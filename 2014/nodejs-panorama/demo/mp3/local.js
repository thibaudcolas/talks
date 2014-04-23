#!/usr/bin/env node
// https://gist.github.com/TooTallNate/3947591
// ./local.js shamandalie.mp3

var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

fs.createReadStream(process.argv[2])
  .pipe(new lame.Decoder())
  .on('format', function (format) {
    this.pipe(new Speaker(format));
});
