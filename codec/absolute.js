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

/**
 * Decode the given uri.
 * @this {{options: object}} A loader or compilation
 * @returns {boolean|string} False where unmatched else the decoded path
 */
function decode(input) {
  return path.isAbsolute(input) && input;
}

/**
 * Encode the given file path.
 * @this {{options: object}} A loader or compilation
 * @returns {string} A uri
 */
function encode(absolute) {
  return absolute;
}

/**
 * The source-map root where relevant.
 * @this {{options: object}} A loader or compilation
 * @returns {string|undefined} The source-map root applicable to any encoded uri
 */
function root() {
}