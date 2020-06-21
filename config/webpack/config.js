import TerserPlugin from 'terser-webpack-plugin';

// eslint-disable-next-line import/no-default-export
export default {
    entry: {
        worker: './config/webpack/worker.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime'],
                        presets: ['@babel/preset-env']
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
                }
            })
        ]
    },
    output: {
        filename: '[name].js',
        path: '/'
    },
    resolve: {
        mainFields: ['browser', 'main']
    },
    target: 'webworker'
};
