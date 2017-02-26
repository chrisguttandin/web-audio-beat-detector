import { OfflineAudioContext, isSupported } from 'standardized-audio-context';

const INITIAL_THRESHOLD = 0.9;
const MINUMUM_NUMBER_OF_PEAKS = 30;
const MINIMUM_THRESHOLD = 0.3;

const countIntervalsBetweenNearbyPeaks = (peaks) => {
    const intervalCounts = [];

    peaks.forEach((peak, index) => {
        const length = Math.min(peaks.length - index, 10);

        for (let i = 0; i < length; i += 1) {
            const interval = peaks[index + i] - peak;

            const foundInterval = intervalCounts.some((intervalCount) => {
                if (intervalCount.interval === interval) {
                    intervalCount.count += 1;

                    return true;
                }

                return false;
            });

            if (!foundInterval) {
                intervalCounts.push({
                    count: 1,
                    interval
                });
            }
        }
    });

    return intervalCounts;
};

const getPeaksAtThreshold = (data, threshold, sampleRate) => {
    const peaks = [];

    const length = data.length;

    for (let i = 0; i < length; i += 1) {
        if (data[i] > threshold) {
            peaks.push(i);

            // Skip forward 1/4s to get past this peak.
            i += (sampleRate / 4) - 1;
        }
    }

    return peaks;
};

const groupNeighborsByTempo = (intervals, sampleRate) => {
    const tempoCounts = [];

    intervals
        .filter((intervalCount) => (intervalCount.interval !== 0))
        .forEach((intervalCount) => {
            // Convert an interval to tempo
            let theoreticalTempo = 60 / (intervalCount.interval / sampleRate);

            // Adjust the tempo to fit within the 90-180 BPM range
            while (theoreticalTempo < 90) {
                theoreticalTempo *= 2;
            }
            while (theoreticalTempo > 180) {
                theoreticalTempo /= 2;
            }

            const foundTempo = tempoCounts.some((tempoCount) => {
                if (tempoCount.tempo === theoreticalTempo) {
                    tempoCount.count += intervalCount.count;

                    return true;
                }

                return false;
            });

            if (!foundTempo) {
                tempoCounts.push({
                    count: intervalCount.count,
                    tempo: theoreticalTempo
                });
            }
        });

    return tempoCounts;
};

export const analyze = (audioBuffer) => {
    const offlineAudioContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
    const biquadFilter = offlineAudioContext.createBiquadFilter();
    const bufferSourceNode = offlineAudioContext.createBufferSource();

    biquadFilter.frequency.value = 200;
    biquadFilter.type = 'lowpass';

    bufferSourceNode.buffer = audioBuffer;

    // @todo Remove this ugly hack again when possible.
    (<any> bufferSourceNode
        .connect(biquadFilter))
        .connect(offlineAudioContext.destination);

    bufferSourceNode.start(0);

    return offlineAudioContext
        .startRendering()
        .then((renderedBuffer) => {
            let peaks = [];
            let threshold = INITIAL_THRESHOLD;

            while (peaks.length < MINUMUM_NUMBER_OF_PEAKS && threshold >= MINIMUM_THRESHOLD) {
                peaks = getPeaksAtThreshold(renderedBuffer.getChannelData(0), threshold, renderedBuffer.sampleRate);
                threshold -= 0.05;
            }

            const intervals = countIntervalsBetweenNearbyPeaks(peaks);
            const groups = groupNeighborsByTempo(intervals, renderedBuffer.sampleRate);

            groups.sort((a, b) => b.count - a.count);

            return Math.round(groups[0].tempo);
        });
};

export { isSupported };
