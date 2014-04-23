#!/usr/bin/env node
// distant.js http://localhost:1337/thismustbetheplace.mp3

var request = require('request');
var lame = require('lame');
var Speaker = require('speaker');

request(process.argv[2])
  .pipe(new lame.Decoder())
  .on('format', function (format) {
    this.pipe(new Speaker(format));
});
