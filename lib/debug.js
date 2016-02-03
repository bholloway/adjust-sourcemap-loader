'use strict';

var PACKAGE_NAME = require('../package.json').name;

/**
 * Format a debug message
 * @param {{resourcePath:string, loaders:Array, loaderIndex:number}} loader The loader context
 * @param {Array.<string>} input The sources list coming into the loader
 * @param {Array.<string>} [absolute] The sources list as absolute file paths
 * @param {Array.<string>} [output] The sources list going out of the loader
 * @returns {string}
 */
function debug(loader, input, absolute, output) {
  var CR_TAB = '\n           ';
  return [
    ' ',
    PACKAGE_NAME + ':',
    '  ' + loader.resourcePath,
    '         @ ' + precedingRequests(loader).join(CR_TAB),
    '     INPUT ' + (input ? input.join(CR_TAB) : '(source-map absent)'),
    absolute && ('  ABSOLUTE ' + absolute.join(CR_TAB)),
    output && ('    OUTPUT ' + output.join(CR_TAB))
  ]
    .filter(Boolean)
    .join('\n');
}

module.exports = debug;

/**
 * Find the requests that precede this loader in the loader chain
 * @param {{loaders:Array, loaderIndex:number}} loader The loader context
 * @returns {Array.<string>} A list of requests
 */
function precedingRequests(loader) {
  return loader.loaders
    .slice(loader.loaderIndex + 1)
    .reverse()
    .map(dotRequest);

  function dotRequest(obj) {
    return obj.request;
  }
}