'use strict';

var assert    = require('assert'),
    camelcase = require('camelcase');

/**
 * Reducer function that converts a codec list to a hash.
 * @param {object} reduced The incomming (and outgoing) hash
 * @param {{name:string, decode:function, encode:function, root:function}} candidate A possible coded
 * @returns {*}
 */
function reduceCodecs(reduced, candidate) {
  assert(
    !!candidate && (typeof candidate === 'object'),
    'Codec must be an object'
  );
  assert(
    (typeof candidate.name === 'string') && /^[\w-]+$/.test(candidate.name),
    'Codec.name must be a kebab-case string'
  );
  assert(
    (typeof candidate.decode === 'function') && (candidate.decode.length === 1),
    'Codec.decode must be a function that accepts a single source string'
  );
  assert(
    (typeof candidate.encode === 'function') && (candidate.encode.length === 1),
    'Codec.encode must be a function that accepts a single absolute path string'
  );
  assert(
    (typeof candidate.root === 'function') && (candidate.root.length === 0),
    'Codec.root must be a function that accepts no arguments'
  );

  var key = camelcase(candidate.name);
  reduced[key] = candidate;
  return reduced;
}

module.exports = reduceCodecs;