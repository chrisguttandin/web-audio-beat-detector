module.exports = () => {
    return {
        'build': {
            cmd: 'npm run build'
        },
        'test-integration-browser': {
            cmd: 'npm run test:integration-browser'
        },
        'test-integration-node': {
            cmd: 'npm run test:integration-node'
        }
    };
};
