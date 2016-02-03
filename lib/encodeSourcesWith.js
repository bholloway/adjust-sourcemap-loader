'use strict';

var getFieldAsFn = require('./getFieldAsFn'),
    getError     = require('./getError');

function encodeSourcesWith(codec) {
  var encoder = getFieldAsFn('encode')(codec);
  if (!encoder) {
    throw new getError('Specified format does not have a matching "encoder" function');
  }

  return function encode(absoluteSource) {

  };
}

module.exports = encodeSourcesWith;
