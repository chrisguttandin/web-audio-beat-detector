module.exports = {
    worker: {
        files: {
            'src/worker/worker.ts': [
                'src/worker/worker.ts'
            ]
        },
        options: {
            patterns: [ {
                match: /(.*)/s,
                replacement: (match) => {
                    const workerString = match
                        .replace(/\\/g, '\\\\')
                        .replace(/\${/g, '\\${');

                    return `// tslint:disable-next-line:max-line-length\nexport const worker = \`${ workerString }\`;\n`;
                }
            } ]
        }
    }
};
