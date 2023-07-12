module.exports = (grunt) => {
    const continuous = grunt.option('continuous') === true;
    const fix = grunt.option('fix') === true;

    return {
        'build-es2019': {
            cmd: 'tsc --project src/tsconfig.json'
        },
        'build-es5': {
            cmd: 'rollup --config config/rollup/bundle.mjs'
        },
        'build-node': {
            cmd: 'babel ./build/es2019 --config-file ./config/babel/build.json --out-dir ./build/node'
        },
        'clean': {
            cmd: 'rimraf build/*'
        },
        'lint-config': {
            cmd: 'npm run lint:config'
        },
        'lint-src': {
            cmd: 'tslint --config config/tslint/src.json --project src/tsconfig.json src/*.ts src/**/*.ts'
        },
        'lint-test': {
            cmd: `eslint --config config/eslint/test.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives test/`
        },
        'test-integration-browser': {
            cmd: `karma start config/karma/config-integration.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-integration-node': {
            cmd: 'mocha --bail --parallel --recursive --require config/mocha/config-integration.js test/integration'
        },
        'webpack': {
            cmd: `webpack --config config/webpack/worker-es2019.js`
        }
    };
};
