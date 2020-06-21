import { OfflineAudioContext } from 'standardized-audio-context';

const offlineAudioContext = new OfflineAudioContext(1, 1, 44100);

export const loadFixtureAsAudioBuffer = (fixture) =>
    fetch(`/base/test/fixtures/${fixture}`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => offlineAudioContext.decodeAudioData(arrayBuffer));
