'use strict';

var path = require('path');

/**
 * Codec for absolute paths
 * @type {{decode: decode, encode: encode}}
 */
module.exports = {
  decode: decode,
  encode: encode
};

function decode(input) {
  return path.isAbsolute(input) && input;
}

function encode(absolute) {
  return absolute;
}