const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { RawSource } = require('webpack-sources');

module.exports = {
    entry: {
        worker: './node_modules/web-audio-beat-detector-worker/build/es2019/module.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime'],
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    include: ['transform-template-literals'],
                                    targets: {
                                        browsers: [
                                            'last 2 Chrome versions',
                                            'last 2 ChromeAndroid versions',
                                            'last 2 Edge versions',
                                            'last 2 Firefox versions',
                                            'last 2 FirefoxAndroid versions',
                                            'last 2 iOS versions',
                                            'last 2 Opera versions',
                                            'last 2 Safari versions'
                                        ]
                                    }
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: {
                    banner: false,
                    condition: /^\**!|@preserve|@license|@cc_on/,
                    filename: '3rdpartylicenses.txt'
                },
                test: /\.ts$/
            })
        ]
    },
    output: {
        filename: '[name].ts',
        path: resolve('src/worker/')
    },
    plugins: [
        {
            apply(compiler) {
                compiler.hooks.compilation.tap('WrapperPlugin', (compilation) => {
                    compilation.hooks.processAssets.tap(
                        {
                            name: 'WrapperPlugin',
                            stage: 700
                        },
                        () => {
                            for (const chunk of compilation.chunks) {
                                for (const file of chunk.files) {
                                    compilation.updateAsset(file, (asset) => {
                                        const workerString = asset.source().replace(/\\/g, '\\\\').replace(/\${/g, '\\${');

                                        return new RawSource(`// This is the minified and stringified code of the web-audio-beat-detector-worker package.
export const worker = \`${workerString}\`; // tslint:disable-line:max-line-length
`);
                                    });
                                }
                            }
                        }
                    );
                });
            }
        }
    ],
    target: 'webworker'
};
