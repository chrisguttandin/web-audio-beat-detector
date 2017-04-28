import { OfflineAudioContext, isSupported } from 'standardized-audio-context';
import { IIntervalBucket, ITempoBucket } from './interfaces';

const INITIAL_THRESHOLD = 0.9;
const MINUMUM_NUMBER_OF_PEAKS = 30;
const MINIMUM_THRESHOLD = 0.3;

const countIntervalsBetweenNearbyPeaks = (peaks: number[]) => {
    const intervalBuckets: IIntervalBucket[] = [];

    peaks
        .forEach((peak, index) => {
            const length = Math.min(peaks.length - index, 10);

            for (let i = 1; i < length; i += 1) {
                const interval = peaks[index + i] - peak;

                const foundInterval = intervalBuckets.some((intervalBucket) => {
                    if (intervalBucket.interval === interval) {
                        intervalBucket.peaks.push(peak);

                        return true;
                    }

                    return false;
                });

                if (!foundInterval) {
                    intervalBuckets.push({
                        peaks: [ peak ],
                        interval
                    });
                }
            }
        });

    return intervalBuckets;
};

const getPeaksAtThreshold = (channelData: Float32Array, threshold: number, sampleRate: number) => {
    const peaks = [];

    const length = channelData.length;

    for (let i = 0; i < length; i += 1) {
        if (channelData[i] > threshold) {
            peaks.push(i);

            // Skip 0.25 seconds forward to get past this peak.
            i += (sampleRate / 4) - 1;
        }
    }

    return peaks;
};

const groupNeighborsByTempo = (intervalBuckets: IIntervalBucket[], sampleRate: number) => {
    const tempoBuckets: ITempoBucket[] = [];

    intervalBuckets
        .forEach((intervalBucket) => {
            // Convert an interval to a tempo (aka BPM).
            let theoreticalTempo = 60 / (intervalBucket.interval / sampleRate);

            // Adjust the tempo to fit within the 90-180 BPM range.
            while (theoreticalTempo < 90) {
                theoreticalTempo *= 2;
            }
            while (theoreticalTempo > 180) {
                theoreticalTempo /= 2;
            }

            const foundTempo = tempoBuckets.some((tempoCount) => {
                if (tempoCount.tempo === theoreticalTempo) {
                    tempoCount.peaks = [ ...tempoCount.peaks, ...intervalBucket.peaks ];

                    return true;
                }

                return false;
            });

            if (!foundTempo) {
                tempoBuckets.push({
                    peaks: intervalBucket.peaks,
                    tempo: theoreticalTempo
                });
            }
        });

    return tempoBuckets;
};

const computeTempoBuckets = (audioBuffer: AudioBuffer, offset: number, duration: number) => {
    const offlineAudioContext = new OfflineAudioContext(audioBuffer.numberOfChannels, duration * audioBuffer.sampleRate, audioBuffer.sampleRate);
    const biquadFilter = offlineAudioContext.createBiquadFilter();
    const bufferSourceNode = offlineAudioContext.createBufferSource();

    biquadFilter.frequency.value = 200;
    biquadFilter.type = 'lowpass';

    bufferSourceNode.buffer = audioBuffer;

    bufferSourceNode
        .connect(biquadFilter)
        .connect(offlineAudioContext.destination);

    bufferSourceNode.start(0, offset, duration);

    return offlineAudioContext
        .startRendering()
        .then((renderedBuffer) => {
            let peaks: number[] = [];
            let threshold = INITIAL_THRESHOLD;

            const channelData = new Float32Array(renderedBuffer.length);

            renderedBuffer.copyFromChannel(channelData, 0);

            while (peaks.length < MINUMUM_NUMBER_OF_PEAKS && threshold >= MINIMUM_THRESHOLD) {
                peaks = getPeaksAtThreshold(channelData, threshold, renderedBuffer.sampleRate);
                threshold -= 0.05;
            }

            const intervalBuckets = countIntervalsBetweenNearbyPeaks(peaks);
            const tempoBuckets = groupNeighborsByTempo(intervalBuckets, renderedBuffer.sampleRate);

            tempoBuckets.sort((a, b) => b.peaks.length - a.peaks.length);

            return tempoBuckets;
        });
};

export const analyze = async (audioBuffer: AudioBuffer, offset = 0, duration = audioBuffer.duration - offset) => {
    const tempoBuckets = await computeTempoBuckets(audioBuffer, offset, duration);

    return tempoBuckets[0].tempo;
};

export const guess = async (audioBuffer: AudioBuffer, offset = 0, duration = audioBuffer.duration - offset) => {
    const tempoBuckets = await computeTempoBuckets(audioBuffer, offset, duration);

    const { peaks, tempo } = tempoBuckets[0];
    const bpm = Math.round(tempo);
    const secondsPerBeat = 60 / bpm;

    peaks.sort((a, b) => a - b);

    offset = (peaks[0] / audioBuffer.sampleRate);

    while (offset > secondsPerBeat) {
        offset -= secondsPerBeat;
    }

    return {
        bpm,
        offset
    };
}

export { isSupported };
