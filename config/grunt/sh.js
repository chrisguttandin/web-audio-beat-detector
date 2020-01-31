module.exports = (grunt) => {
    const continuous = (grunt.option('continuous') === true);
    const fix = (grunt.option('fix') === true);

    return {
        'build-es2018': {
            cmd: 'tsc -p src/tsconfig.json'
        },
        'build-es5': {
            cmd: 'rollup --config config/rollup/bundle.js'
        },
        'lint-config': {
            cmd: `eslint --config config/eslint/config.json --ext .js ${ (fix) ? '--fix ' : '' }--report-unused-disable-directives *.js config/`
        },
        'lint-src': {
            cmd: 'tslint --config config/tslint/src.json --project src/tsconfig.json src/*.ts src/**/*.ts'
        },
        'lint-test': {
            cmd: `eslint --config config/eslint/test.json --ext .js ${ (fix) ? '--fix ' : '' }--report-unused-disable-directives test/`
        },
        'test-integration': {
            cmd: `karma start config/karma/config-integration.js ${ continuous ? '--concurrency Infinity' : '--single-run' }`
        }
    };
};
