# web-audio-beat-detector

**A beat detection utility which is using the Web Audio API.**

[![tests](https://img.shields.io/travis/chrisguttandin/web-audio-beat-detector/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/web-audio-beat-detector)
[![dependencies](https://img.shields.io/david/chrisguttandin/web-audio-beat-detector.svg?style=flat-square)](https://www.npmjs.com/package/web-audio-beat-detector)
[![version](https://img.shields.io/npm/v/web-audio-beat-detector.svg?style=flat-square)](https://www.npmjs.com/package/web-audio-beat-detector)

This module is based on the technique explainend by [Joe Sullivan](http://joesul.li/van/) in his
article
[Beat Detection Using JavaScript and the Web Audio API](http://joesul.li/van/beat-detection-using-web-audio/).
It is a very easy algorithm which retrieves the beats as BPM of a given AudioBuffer.

A more comprehensive implemetation has been done by [José M. Pérez](https://jmperezperez.com). It
comes with an UI to search for tracks on Spotify which can then be analyzed. He also wrote a blog
post
([Detecting tempo of a song using brower's Audio API](https://jmperezperez.com/bpm-detection-javascript/))
about it.
