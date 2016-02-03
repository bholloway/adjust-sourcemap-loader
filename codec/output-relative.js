'use strict';

var path = require('path'),
    fs   = require('fs');

var getOutputDirectory = require('./utility/get-context-directory');

/**
 * Codec for relative paths with respect to the output directory
 * @type {{decode: decode, encode: encode}}
 */
module.exports = {
  decode: decode,
  encode: encode
};

function decode(relative) {
  /* jshint validthis:true */
  if (!path.isAbsolute(relative)) {
    var base    = getOutputDirectory(this),
        absFile = path.normalize(path.join(base, relative));
    return absFile && fs.existsSync(absFile) && fs.statSync(absFile).isFile() && absFile;
  }
}

function encode(absolute) {
  /* jshint validthis:true */
  var base = getOutputDirectory(this);
  if (!base) {
    throw new Error('Cannot locate the Webpack output directory');
  }
  else {
    return path.relative(base, absolute);
  }
}