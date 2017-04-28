import { analyze, guess } from '../../src/module';
import bpmData from '../fixtures/bpm-data.json';
import { loadFixtureAsAudioBuffer } from '../helper/load-fixture';
import tempoData from '../fixtures/tempo-data.json';

describe('web-audio-beat-detector', () => {

    describe('analyze()', () => {

        leche.withData(tempoData, (filename, tempo) => { // eslint-disable-line no-undef

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

    });

    describe('guess()', () => {

        leche.withData(bpmData, (filename, bpm, offset) => { // eslint-disable-line no-undef

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

    });

});
