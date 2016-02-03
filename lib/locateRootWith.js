'use strict';

var getFieldAsFn = require('./getFieldAsFn'),
    getError     = require('./getError');

/**
 * Locate the root for input sources using the given codec hash
 * @throws Error Where the given codec is missing an encode function
 * @param {{encode:function} codec A single codec with an `encode` function
 * @returns {function(string):string|Error} An encode function that takes an absolute path
 */
function locateRootWith(codec) {
  /* jshint validthis:true */
  var loader = this,
      root   = getFieldAsFn('root')(codec);
  if (!root) {
    return new getError('Specified format does not have a matching "root" function');
  }
  else {
    return function locate() {

      // call the root
      var located;
      try {
        located = root.call(loader);
      }
      catch (exception) {
        return getNamedError(exception);
      }
      return located;

      function getNamedError(details) {
        var name    = codec.name || '(unnamed)',
            message = [
              'Locating root with codec: ' + name,
              details && (details.stack ? details.stack : details)
            ]
              .filter(Boolean)
              .join('\n');
        return new Error(message);
      }
    };
  }
}

module.exports = locateRootWith;
