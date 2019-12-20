module.exports = {
    worker: {
        files: {
            'src/worker/worker.ts': [
                'src/worker/worker.ts'
            ]
        },
        options: {
            patterns: [ {
                match: /.*/s,
                replacement: (match) => {
                    const workerString = match
                        .replace(/\\/g, '\\\\')
                        .replace(/\${/g, '\\${');

                    return `// This is the minified and stringified code of the web-audio-beat-detector-worker package.\nexport const worker = \`${ workerString }\`; // tslint:disable-line:max-line-length\n`;
                }
            } ]
        }
    }
};
