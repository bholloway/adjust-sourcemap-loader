'use strict';

var projectRelative = require('./project-relative');

/**
 * Codec for relative paths with respect to the context directory, preceded by a webpack:// protocol
 * @type {{decode: decode, encode: encode}}
 */
module.exports = {
  decode: decode,
  encode: encode
};

function decode(uri) {
  /* jshint validthis:true */
  var analysis = /^webpack\:\/{2}(.*)$/.exec(uri);
  return analysis && projectRelative.decode.call(this, analysis[1]);
}

function encode(absolute) {
  /* jshint validthis:true */
  return 'webpack://' + projectRelative.encode.call(this, absolute);
}