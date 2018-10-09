module.exports = {
    build: [
        'clean:build',
        'webpack',
        'replace:worker',
        'sh:build-es2018',
        'sh:build-es5'
    ],
    continuous: [
        'build',
        'karma:continuous'
    ],
    lint: [
        'eslint',
        // @todo Use grunt-lint again when it support the type-check option.
        'sh:lint'
    ],
    test: [
        'build',
        'karma:test'
    ]
};
