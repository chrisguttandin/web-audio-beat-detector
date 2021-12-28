module.exports = {
    build: ['clean:build', 'sh:webpack', 'sh:build-es2019', 'sh:build-es5'],
    lint: ['sh:lint-config', 'sh:lint-src', 'sh:lint-test'],
    test: ['build', 'sh:test-integration']
};
