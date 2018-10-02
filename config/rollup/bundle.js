import MemoryFileSystem from 'memory-fs';
import babel from 'rollup-plugin-babel';
import { readFileSync } from 'fs';
import replace from 'rollup-plugin-replace';
import webpack from 'webpack';
import webpackConfig from '../webpack/config.js';

const workerFile = readFileSync('src/worker/worker.ts', 'utf-8');
const result = /export\sconst\sworker\s=\s`(.*)`;/g.exec(workerFile);

if (result === null) {
    throw new Error('The worker file could not be parsed.');
}

const workerString = result[1];
const memoryFileSystem = new MemoryFileSystem();

let transpiledWorkerString = null;

export default {
    input: 'build/es2015/module.js',
    output: {
        file: 'build/es5/bundle.js',
        format: 'umd',
        name: 'webAudioBeatDetector'
    },
    plugins: [
        {
            buildStart () {
                return new Promise((resolve, reject) => {
                    const compiler = webpack(webpackConfig);

                    compiler.outputFileSystem = memoryFileSystem;
                    compiler.run((err, stats) => {
                        if (stats.hasErrors() || stats.hasWarnings()) {
                            reject(new Error(stats.toString({ errorDetails: true, warnings: true })));
                        }

                        transpiledWorkerString = memoryFileSystem.readFileSync('/worker.js', 'utf-8');

                        resolve();
                    });
                });
            }
        },
        replace({
            delimiters: [ '`', '`' ],
            include: 'build/es2015/worker/worker.js',
            values: {
                [ workerString ]: () => {
                    if (transpiledWorkerString === null) {
                        throw new Error('The worker should be transpiled by now.');
                    }

                    return `\`${ transpiledWorkerString }\``;
                }
            }
        }),
        babel({
            exclude: 'node_modules/**',
            plugins: [
                '@babel/plugin-external-helpers',
                '@babel/plugin-transform-runtime'
            ],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false
                    }
                ]
            ],
            runtimeHelpers: true
        })
    ]
};
