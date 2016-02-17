'use strict';

/**
 * Codec for relative paths with respect to the context directory, preceded by a webpack:// protocol
 * @type {{name:string, decode: function, encode: function, root: function}}
 */
module.exports = {
  name    : 'webpack-bootstrap',
  decode  : decode,
  abstract: true
};

/**
 * Decode the given uri.
 * @this {{options: object}} A loader or compilation
 * @returns {boolean|string} False where unmatched else the decoded path
 */
function decode(uri) {
  /* jshint validthis:true */
  var analysis = /^webpack\/bootstrap\s+\w{20}$/.exec(uri);
  return !!analysis;
}