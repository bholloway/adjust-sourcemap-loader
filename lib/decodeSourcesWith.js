'use strict';

var fs = require('fs');

var getFieldAsFn = require('./getFieldAsFn');

function decodeSourcesWith(codecs) {
  /* jshint validthis:true */
  var loader = this;

  // get a list of valid decoders
  var candidates = Object.keys(codecs)
    .reduce(reduceValidDecoder.bind(loader, codecs), []);

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
        decoded = candidates[i].decoder.call(loader, inputSource);
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
      var name    = candidates[i].name,
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
  var decoder = getFieldAsFn('decode')(codecs[key]);

  return decoder ? reduced.concat({
    name   : key,
    decoder: decoder
  }) : reduced;
}