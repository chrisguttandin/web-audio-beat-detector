'use strict';

module.exports = (config) => {

    config.set({

        basePath: '../../',

        files: [
            {
                included: false,
                pattern: 'src/**/*.js',
                served: false,
                watched: true
            }, {
                included: false,
                pattern: 'test/fixtures/**',
                served: true,
                watched: true
            },
            'test/integration/**/*.js'
        ],

        frameworks: [
            'browserify',
            'leche',
            'mocha',
            'sinon-chai'
        ],

        preprocessors: {
            'test/integration/**/*.js': 'browserify'
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browsers: [
                'ChromeSauceLabs',
                'FirefoxSauceLabs'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.11'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.11'
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'ChromeCanary',
                'FirefoxDeveloper'
            ]

        });

    }

};
