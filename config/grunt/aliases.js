module.exports = {
    build: [
        'clean:build',
        'sh:build-es2015',
        'sh:build-es5',
        'sh:build-esm'
    ],
    continuous: [
        'karma:continuous'
    ],
    lint: [
        'eslint',
        // @todo Use grunt-lint again when it support the type-check option.
        'sh:lint'
    ],
    test: [
        'karma:test'
    ]
};
