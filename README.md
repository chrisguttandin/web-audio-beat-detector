![logo](https://repository-images.githubusercontent.com/61281324/6526e580-3b28-11ea-90ce-be241599f494)

# web-audio-beat-detector

**A beat detection utility which is using the Web Audio API.**

[![version](https://img.shields.io/npm/v/web-audio-beat-detector.svg?style=flat-square)](https://www.npmjs.com/package/web-audio-beat-detector)

This module is based on the technique explained by [Joe Sullivan](http://joesul.li/van/) in his article [Beat Detection Using JavaScript and the Web Audio API](http://joesul.li/van/beat-detection-using-web-audio/). It retrieves the beats as BPM of a given AudioBuffer. The algorithm used is not as complex (and expensive to compute) as many others. But it yields surprisingly good results especially for electronic music.

## Usage

The `web-audio-beat-detector` module is available on
[npm](https://www.npmjs.com/package/web-audio-beat-detector) and can be installed as usual.

```shell
npm install web-audio-beat-detector
```

You can then import its public function `analyze()` like this:

```js
import { analyze } from 'web-audio-beat-detector';
```

The `analyze()` function expects an `AudioBuffer` as its first parameter and it returns a `Promise`
which eventually resolves with the tempo of that buffer as a number. An example usage might look
like this:

```js
analyze(audioBuffer)
    .then((tempo) => {
        // the tempo could be analyzed
    })
    .catch((err) => {
        // something went wrong
    });
```

Additionally you can also import the `guess()` function like this:

```js
import { guess } from 'web-audio-beat-detector';
```

The `guess()` function expects an `AudioBuffer` as well and also returns a `Promise`. The `Promise`
will resolve with an object containing the estimated BPM (the rounded tempo) and the offset of the
first beat in seconds.

```js
guess(audioBuffer)
    .then(({ bpm, offset, tempo }) => {
        // the bpm and offset could be guessed
        // the tempo is the same as the one returned by analyze()
    })
    .catch((err) => {
        // something went wrong
    });
```

`analyze()` and `guess()` do both support `offset` and `duration` as optional arguments. When specified these two values are used to select only a part of the given `AudioBuffer`. There usage is the same as described in the documentation of the [`AudioBufferSourceNode.start()`](https://webaudio.github.io/web-audio-api/#widl-AudioBufferSourceNode-start-void-double-when-double-offset-double-duration) method.

By default the bpm are expected to be between 90 and 180 bpm. This can be changed by specifying the `tempoSettings`. These can be passed as the last argument to `analyze()` or `guess()`.

```js
// with an offset and duration
analyze(audioBuffer, 1, 10, { maxTempo: 120, minTempo: 60 });
// with no other arguments
analyze(audioBuffer, { maxTempo: 120, minTempo: 60 });
```

## Acknowledgement

A more comprehensive implementation has been done by [José M. Pérez](https://jmperezperez.com). It
comes with an UI to search for tracks on Spotify which can then be analyzed. He also wrote a blog
post
([Detecting tempo of a song using browser's Audio API](https://jmperezperez.com/bpm-detection-javascript/))
about it.
