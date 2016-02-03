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
function debug(loader, input, absolute, output, root) {
  var CR_TAB = '\n           ';
  return [
    ' ',
    PACKAGE_NAME + ':',
    '  ' + loader.resourcePath,
    '         @ ' + precedingRequest(loader),
    '     INPUT ' + (input ? input.join(CR_TAB) : '(source-map absent)'),
    absolute && ('  ABSOLUTE ' + absolute.join(CR_TAB)),
    output && ('    OUTPUT ' + output.join(CR_TAB)),
    root && ('      ROOT ' + root)
  ]
    .filter(Boolean)
    .join('\n');
}

module.exports = debug;

/**
 * Find the request that precedes this loader in the loader chain
 * @param {{loaders:Array, loaderIndex:number}} loader The loader context
 * @returns {string} The request of the preceding loader
 */
function precedingRequest(loader) {
  var index = loader.loaderIndex + 1;
  return (index in loader.loaders) ? loader.loaders[index].request : '(no preceding loader)';
}