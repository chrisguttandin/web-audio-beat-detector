import { analyze, guess } from '../../src/module';
import bpmOffsetData from '../fixtures/bpm-offset-data.json';
import { loadFixtureAsAudioBuffer } from '../helper/load-fixture';
import tempoData from '../fixtures/tempo-data.json';

describe('web-audio-beat-detector', () => {
    describe('analyze()', () => {
        leche.withData(tempoData, (filename, tempo) => {
            let audioBuffer;

            beforeEach(async function () {
                this.timeout(15000);

                audioBuffer = await loadFixtureAsAudioBuffer(filename);
            });

            it('should analyze the tempo of the file', async function () {
                this.timeout(15000);

                expect(await analyze(audioBuffer)).to.be.closeTo(tempo, 0.005);
            });
        });

        describe('with a file without detectable beats', () => {
            let audioBuffer;

            beforeEach(async function () {
                this.timeout(15000);

                audioBuffer = await loadFixtureAsAudioBuffer('tombo-piano.wav');
            });

            it('should throw an error', function (done) {
                this.timeout(15000);

                analyze(audioBuffer).catch((err) => {
                    expect(err.message).to.equal('The given channelData does not contain any detectable beats.');

                    done();
                });
            });
        });
    });

    describe('guess()', () => {
        leche.withData(bpmOffsetData, (filename, bpm, offset, tempo) => {
            let audioBuffer;

            beforeEach(async function () {
                this.timeout(15000);

                audioBuffer = await loadFixtureAsAudioBuffer(filename);
            });

            it('should guess the bpm, the offset and the tempo of the file', async function () {
                this.timeout(15000);

                const result = await guess(audioBuffer);

                expect(result.offset).to.closeTo(offset, 0.005);
                expect(result.tempo).to.be.closeTo(tempo, 0.005);
                expect(result).to.deep.equal({ bpm, offset: result.offset, tempo: result.tempo });
            });
        });

        describe('with a file without detectable beats', () => {
            let audioBuffer;

            beforeEach(async function () {
                this.timeout(15000);

                audioBuffer = await loadFixtureAsAudioBuffer('tombo-piano.wav');
            });

            it('should throw an error', function (done) {
                this.timeout(15000);

                guess(audioBuffer).catch((err) => {
                    expect(err.message).to.equal('The given channelData does not contain any detectable beats.');

                    done();
                });
            });
        });
    });
});
