import { analyze } from '../../src/module';
import bpmData from '../fixtures/bpm-data.json';
import { loadFixtureAsAudioBuffer } from '../helper/load-fixture';

describe('web-audio-beat-detector', () => {

    describe('analyze()', () => {

        leche.withData(bpmData, (filename, bpm) => { // eslint-disable-line no-undef

            it('should analyze the bpm of the file', function (done) {
                this.timeout(15000);

                loadFixtureAsAudioBuffer(filename, (err, audioBuffer) => {
                    expect(err).to.be.null;

                    analyze(audioBuffer)
                        .then((beatsPerMinute) => {
                            expect(beatsPerMinute).to.deep.equal(bpm);

                            done();
                        });
                });
            });

        });

    });

});
