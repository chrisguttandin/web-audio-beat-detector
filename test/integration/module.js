import { analyze, guess } from '../../src/module';
import bpmOffsetData from '../fixtures/bpm-offset-data.json';
import { loadFixtureAsAudioBuffer } from '../helper/load-fixture';
import tempoData from '../fixtures/tempo-data.json';

describe('web-audio-beat-detector', () => {

    describe('analyze()', () => {

        leche.withData(tempoData, (filename, tempo) => {

            it('should analyze the tempo of the file', function (done) {
                this.timeout(15000);

                loadFixtureAsAudioBuffer(filename, (err, audioBuffer) => {
                    expect(err).to.be.null;

                    analyze(audioBuffer)
                        .then((tmp) => {
                            expect(tempo).to.deep.equal(tmp);

                            done();
                        });
                });
            });

        });

        describe('with a file without detectable beats', () => {

            it('should throw an error', function (done) {
                this.timeout(15000);

                loadFixtureAsAudioBuffer('tombo-piano.wav', (err, audioBuffer) => {
                    expect(err).to.be.null;

                    analyze(audioBuffer)
                        .catch((err2) => {
                            expect(err2.message).to.equal('The given channelData does not contain any detectable beats.');

                            done();
                        });
                });
            });

        });

    });

    describe('guess()', () => {

        leche.withData(bpmOffsetData, (filename, bpm, offset) => {

            it('should guess the bpm and the offset of the file', function (done) {
                this.timeout(15000);

                loadFixtureAsAudioBuffer(filename, (err, audioBuffer) => {
                    expect(err).to.be.null;

                    guess(audioBuffer)
                        .then(({ bpm: btsPrMnt, offset: ffst }) => {
                            expect(bpm).to.deep.equal(btsPrMnt);
                            expect(offset).to.deep.equal(ffst);

                            done();
                        });
                });
            });

        });

        describe('with a file without detectable beats', () => {

            it('should throw an error', function (done) {
                this.timeout(15000);

                loadFixtureAsAudioBuffer('tombo-piano.wav', (err, audioBuffer) => {
                    expect(err).to.be.null;

                    guess(audioBuffer)
                        .catch((err2) => {
                            expect(err2.message).to.equal('The given channelData does not contain any detectable beats.');

                            done();
                        });
                });
            });

        });

    });

});
