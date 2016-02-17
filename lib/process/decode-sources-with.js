'use strict';

var fs = require('fs');

var getFieldAsFn = require('./get-field-as-fn');

/**
 * Create a decoder for input sources using the given codec hash
 * @this {object} A loader or compilation
 * @param {object} codecs A hash of codecs, each with a `decode` function
 * @returns {function(string):string|Error} A decode function that returns an absolute path or else an Error
 */
function decodeSourcesWith(codecs) {
  /* jshint validthis:true */
  var context = this;

  // get a list of valid decoders
  var candidates = Object.keys(codecs)
    .reduce(reduceValidDecoder.bind(null, codecs), []);

  /**
   * Attempt to decode the given source path using the previously supplied codecs
   * @param {string} inputSource A source path from a source map
   * @returns {Error|string|null} An absolute path if decoded else an error if encountered
   */
  return function decode(inputSource) {

    // attempt all candidates until a match
    for (var i = 0, decoded = null; i < candidates.length && !decoded; i++) {

      // call the decoder
      try {
        decoded = candidates[i].decode.call(context, inputSource);
      }
      catch (exception) {
        return getNamedError(exception);
      }

      // match implies a return value
      if (decoded) {
        if (typeof decoded !== 'string') {
          return getNamedError('Decoder returned a truthy value but it is not a string file path:\n' + decoded);
        }
        else if (!fs.existsSync(decoded) || !fs.statSync(decoded).isFile()) {
          return getNamedError('Cannot find file at absolute path:\n' + decoded);
        }
        else {
          return decoded;
        }
      }
    }

    // default is an error
    return new Error('No viable decoder for source: ' + inputSource);

    function getNamedError(details) {
      var name    = candidates[i].name || '(unnamed)',
          message = [
            'Decoding with codec: ' + name,
            'Incoming source: ' + inputSource,
            details && (details.stack ? details.stack : details)
          ]
            .filter(Boolean)
            .join('\n');
      return new Error(message);
    }
  };
}

module.exports = decodeSourcesWith;

function reduceValidDecoder(codecs, reduced, key) {
  var codec   = codecs[key],
      decoder = getFieldAsFn('decode')(codec);
  return decoder ? reduced.concat(codec) : reduced;
}