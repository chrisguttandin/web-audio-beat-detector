module.exports = {
    build: [
        'clean:build',
        'webpack',
        'replace:worker',
        'sh:build-es2019',
        'sh:build-es5'
    ],
    lint: [
        'sh:lint-config',
        'sh:lint-src',
        'sh:lint-test'
    ],
    test: [
        'build',
        'sh:test-integration'
    ]
};
