const { env } = require('process');

// eslint-disable-next-line padding-line-between-statements
const filter = (predicate, ...tasks) => (predicate ? tasks : []);
const isTarget = (...targets) => env.TARGET === undefined || targets.includes(env.TARGET);
const isType = (...types) => env.TYPE === undefined || types.includes(env.TYPE);

module.exports = {
    build: ['sh:clean', 'sh:webpack', 'sh:build-es2019', 'sh:build-es5', 'sh:build-node'],
    lint: ['sh:lint-config', 'sh:lint-src', 'sh:lint-test'],
    test: [
        'build',
        ...filter(
            isType('integration'),
            ...filter(isTarget('chrome', 'firefox', 'safari'), 'sh:test-integration-browser'),
            ...filter(isTarget('node'), 'sh:test-integration-node')
        )
    ]
};
