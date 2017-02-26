module.exports = {
    build: [
        'clean:build',
        'sh:build',
        'uglify'
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
