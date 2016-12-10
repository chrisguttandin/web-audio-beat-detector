import { OfflineAudioContext } from 'standardized-audio-context';

const base64ToArrayBuffer = (encodedData) => {
    const decodedData = atob(encodedData.replace(/\s/g, ''));
    const uint8Array = new Uint8Array(decodedData.length);

    Array.prototype.forEach.call(uint8Array, (value, index) => {
        uint8Array[index] = decodedData.charCodeAt(index);
    });

    return uint8Array.buffer;
};

export const loadFixtureAsAudioBuffer = (fixture, callback) => {
    const request = new XMLHttpRequest();

    request.onerror = () => callback('request-failed');
    request.onload = (event) => {
        const arrayBuffer = event.target.response;
        const offlineAudioContext = new OfflineAudioContext(1, 1, 44100);

        if (fixture.slice(-4) === '.txt') {
            arrayBuffer = base64ToArrayBuffer(arrayBuffer);
        }

        offlineAudioContext
            .decodeAudioData(arrayBuffer)
            .then((audioBuffer) => callback(null, audioBuffer))
            .catch((err) => callback(err));
    };
    request.open('GET', 'base/test/fixtures/' + fixture);

    if (fixture.slice(-4) !== '.txt') {
        request.responseType = 'arraybuffer';
    }

    request.send();
};
