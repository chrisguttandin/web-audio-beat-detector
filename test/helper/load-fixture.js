import { OfflineAudioContext } from 'standardized-audio-context';

export const loadFixtureAsAudioBuffer = (fixture, callback) => {
    const request = new XMLHttpRequest();

    request.onerror = () => callback('request-failed');
    request.onload = (event) => {
        const arrayBuffer = event.target.response;
        const offlineAudioContext = new OfflineAudioContext(1, 1, 44100);

        offlineAudioContext
            .decodeAudioData(arrayBuffer)
            .then((audioBuffer) => callback(null, audioBuffer))
            .catch((err) => callback(err));
    };
    request.open('GET', 'base/test/fixtures/' + fixture);
    request.responseType = 'arraybuffer';

    request.send();
};
