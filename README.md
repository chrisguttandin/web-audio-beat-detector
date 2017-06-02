# web-audio-beat-detector

**A beat detection utility which is using the Web Audio API.**

[![tests](https://img.shields.io/travis/chrisguttandin/web-audio-beat-detector/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/web-audio-beat-detector)
[![dependencies](https://img.shields.io/david/chrisguttandin/web-audio-beat-detector.svg?style=flat-square)](https://www.npmjs.com/package/web-audio-beat-detector)
[![version](https://img.shields.io/npm/v/web-audio-beat-detector.svg?style=flat-square)](https://www.npmjs.com/package/web-audio-beat-detector)

This module is based on the technique explainend by [Joe Sullivan](http://joesul.li/van/) in his
article
[Beat Detection Using JavaScript and the Web Audio API](http://joesul.li/van/beat-detection-using-web-audio/).
It is a very easy algorithm which retrieves the beats as BPM of a given AudioBuffer.

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
    .then(({ bpm, offset }) => {
        // the bpm and offset could be guessed
    })
    .catch((err) => {
        // something went wrong
    });
```

`analyze()` and `guess()` do both support `offset` and `duration` as optional arguments. When
specified these two values are used to select only a part of the given `AudioBuffer`. There usage
is basically the same as described in the documentation of the
[`AudioBufferSourceNode.start()`](https://webaudio.github.io/web-audio-api/#widl-AudioBufferSourceNode-start-void-double-when-double-offset-double-duration)
method.

## Acknowledgement

A more comprehensive implemetation has been done by [José M. Pérez](https://jmperezperez.com). It
comes with an UI to search for tracks on Spotify which can then be analyzed. He also wrote a blog
post
([Detecting tempo of a song using brower's Audio API](https://jmperezperez.com/bpm-detection-javascript/))
about it.
