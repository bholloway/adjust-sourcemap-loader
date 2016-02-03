'use strict';

var path = require('path');

/**
 * Codec for absolute paths
 * @type {{name:string, decode: function, encode: function, root: function}}
 */
module.exports = {
  name  : 'absolute',
  decode: decode,
  encode: encode,
  root  : root
};

function decode(input) {
  return path.isAbsolute(input) && input;
}

function encode(absolute) {
  return absolute;
}

function root() {
  return undefined;
}