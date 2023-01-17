import { readFile, readFileSync, readlink, stat } from 'fs';
import babel from '@rollup/plugin-babel';
import { fileURLToPath } from 'url';
import { fs } from 'memfs';
import { join } from 'path';
import replace from '@rollup/plugin-replace';
import webpack from 'webpack';
// eslint-disable-next-line node/file-extensions-in-import
import webpackConfig from '../webpack/worker-es5.mjs';

const workerFile = readFileSync('src/worker/worker.ts', 'utf8');
const result = /export\sconst\sworker\s=\s`(?<workerString>.*)`;/g.exec(workerFile);

if (result === null) {
    throw new Error('The worker file could not be parsed.');
}

const workerString = result.groups.workerString;

// eslint-disable-next-line import/no-default-export
export default new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);

    compiler.inputFileSystem = {
        readFile(path, ...args) {
            if (path === fileURLToPath(new URL('../../src/worker.js', import.meta.url))) {
                args.pop()(null, "import 'web-audio-beat-detector-worker';");

                return;
            }

            return readFile(path, ...args);
        },
        readlink(path, callback) {
            if (path === fileURLToPath(new URL('../../src/worker.js', import.meta.url))) {
                return readlink(fileURLToPath(new URL(import.meta.url)), callback);
            }

            return readlink(path, callback);
        },
        stat(path, ...args) {
            if (path === fileURLToPath(new URL('../../src/worker.js', import.meta.url))) {
                args.pop()(null, {
                    isFile() {
                        return true;
                    }
                });

                return;
            }

            return stat(path, ...args);
        }
    };
    compiler.outputFileSystem = { ...fs, join };
    compiler.run((err, stats) => {
        if (err !== null) {
            reject(err);
        } else if (stats.hasErrors() || stats.hasWarnings()) {
            reject(new Error(stats.toString({ errorDetails: true, warnings: true })));
        } else {
            const transpiledWorkerString = fs // eslint-disable-line node/no-sync
                .readFileSync('/worker.js', 'utf8')
                .replace(/\\/g, '\\\\')
                .replace(/\${/g, '\\${');

            resolve({
                input: 'build/es2019/module.js',
                output: {
                    file: 'build/es5/bundle.js',
                    format: 'umd',
                    name: 'webAudioBeatDetector'
                },
                plugins: [
                    replace({
                        delimiters: ['`', '`'],
                        include: 'build/es2019/worker/worker.js',
                        values: {
                            // V8 does only accept substrings with a maximum length of 32767 characters. Otherwise it throws a SyntaxError.
                            [workerString.slice(0, 32767)]: `\`${transpiledWorkerString}\``,
                            [workerString.slice(32767)]: ''
                        }
                    }),
                    babel({
                        babelHelpers: 'runtime',
                        exclude: 'node_modules/**',
                        plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime'],
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    modules: false
                                }
                            ]
                        ]
                    })
                ]
            });
        }
    });
});
