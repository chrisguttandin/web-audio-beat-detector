import { load } from 'web-audio-beat-detector-broker';
import { worker } from './worker/worker';

const blob: Blob = new Blob([ worker ], { type: 'application/javascript; charset=utf-8' });

const url: string = URL.createObjectURL(blob);

const webAudioBeatDetector = load(url);

export const analyze = webAudioBeatDetector.analyze;

export const guess = webAudioBeatDetector.guess;
