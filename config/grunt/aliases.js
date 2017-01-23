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
        'tslint'
    ],
    test: [
        'karma:test'
    ]
};
