import babel from '@rollup/plugin-babel';
import { fs } from 'memfs';
import { join } from 'path';
import { readFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import webpack from 'webpack';
import webpackConfig from '../webpack/config';

const workerFile = readFileSync('src/worker/worker.ts', 'utf8');
const result = /export\sconst\sworker\s=\s`(?<workerString>.*)`;/g.exec(workerFile);

if (result === null) {
    throw new Error('The worker file could not be parsed.');
}

const workerString = result.groups.workerString;

// eslint-disable-next-line import/no-default-export
export default new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);

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
