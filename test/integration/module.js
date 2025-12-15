import { analyze, guess } from '../../src/module';
import { beforeEach, describe, expect, it } from 'vitest';
import bpmOffsetData from '../fixtures/bpm-offset-data.json';
import { loadFixtureAsAudioBuffer } from '../helper/load-fixture';
import tempoData from '../fixtures/tempo-data.json';

describe('module', () => {
    describe('analyze()', () => {
        it('should be a function', () => {
            expect(analyze).to.be.a('function');
        });

        if (typeof window !== 'undefined') {
            describe('with a file with detectable beats', () => {
                for (const [filename, tempo] of tempoData) {
                    let audioBuffer;

                    beforeEach(async () => {
                        audioBuffer = await loadFixtureAsAudioBuffer(filename);
                    });

                    it('should analyze the tempo of the file', async () => {
                        expect(await analyze(audioBuffer)).to.be.closeTo(tempo, 0.005);
                    });
                }
            });

            describe('with a file without detectable beats', () => {
                let audioBuffer;

                beforeEach(async () => {
                    audioBuffer = await loadFixtureAsAudioBuffer('tombo-piano.wav');
                });

                it('should throw an error', () => {
                    const { promise, resolve } = Promise.withResolvers();

                    analyze(audioBuffer).catch((err) => {
                        expect(err.message).to.equal('The given channelData does not contain any detectable beats.');

                        resolve();
                    });

                    return promise;
                });
            });
        }
    });

    describe('guess()', () => {
        it('should be a function', () => {
            expect(guess).to.be.a('function');
        });

        if (typeof window !== 'undefined') {
            describe('with a file with detectable beats', () => {
                for (const [filename, bpm, offset, tempo] of bpmOffsetData) {
                    let audioBuffer;

                    beforeEach(async () => {
                        audioBuffer = await loadFixtureAsAudioBuffer(filename);
                    });

                    it('should guess the bpm, the offset and the tempo of the file', async () => {
                        const result = await guess(audioBuffer);

                        expect(result.offset).to.closeTo(offset, 0.005);
                        expect(result.tempo).to.be.closeTo(tempo, 0.005);
                        expect(result).to.deep.equal({ bpm, offset: result.offset, tempo: result.tempo });
                    });
                }
            });

            describe('with a file without detectable beats', () => {
                let audioBuffer;

                beforeEach(async () => {
                    audioBuffer = await loadFixtureAsAudioBuffer('tombo-piano.wav');
                });

                it('should throw an error', () => {
                    const { promise, resolve } = Promise.withResolvers();

                    guess(audioBuffer).catch((err) => {
                        expect(err.message).to.equal('The given channelData does not contain any detectable beats.');

                        resolve();
                    });

                    return promise;
                });
            });
        }
    });
});
