import { load } from 'web-audio-beat-detector-broker';
import { worker } from './worker/worker';

let analyze: ReturnType<typeof load>['analyze'];
let guess: ReturnType<typeof load>['guess'];

if (typeof document !== 'undefined') {

  const blob: Blob = new Blob([worker], { type: 'application/javascript; charset=utf-8' });

  const url: string = URL.createObjectURL(blob);

  ;({analyze, guess} = load(url))

  URL.revokeObjectURL(url);

}

export { analyze, guess }
