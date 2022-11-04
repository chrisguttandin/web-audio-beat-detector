import { OfflineAudioContext } from 'standardized-audio-context';

let offlineAudioContext = null;

export const loadFixtureAsAudioBuffer = (fixture) =>
    fetch(`/base/test/fixtures/${fixture}`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
            if (offlineAudioContext === null) {
                offlineAudioContext = new OfflineAudioContext(1, 1, 44100);
            }

            return offlineAudioContext.decodeAudioData(arrayBuffer);
        });
