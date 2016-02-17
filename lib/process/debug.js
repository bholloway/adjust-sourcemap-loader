'use strict';

const PACKAGE_NAME = require('../../package.json').name;

/**
 * Format a debug message
 * @param {{resourcePath:string, loaders:Array, loaderIndex:number}} context A loader or compilation
 * @param {Array.<string>} input The sources list coming into the loader
 * @param {Array.<string>} [absolute] The sources list as absolute file paths
 * @param {Array.<string>} [output] The sources list going out of the loader
 * @param {string} [root] The source-map root encoded by the loader
 * @returns {string}
 */
function debug(context, input, absolute, output, root) {
  return [
    ' ',
    PACKAGE_NAME + ':',
    '  ' + context.resourcePath,
    formatField('@', precedingRequest(context)),
    formatField('INPUT', input || '(source-map absent)'),
    formatField('ABSOLUTE', absolute),
    formatField('OUTPUT', output),
    formatField('ROOT', root)
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
  return !Array.isArray(loader.loaders) ? undefined :
    (index in loader.loaders) ? loader.loaders[index].request :
      '(no preceding loader)';
}

/**
 * Where the data is truthy then format it with a right-aligned title.
 * @param {string} title
 * @param {*} data The data to display
 * @returns {boolean|string} False where data is falsey, else formatted message
 */
function formatField(title, data) {
  const PADDING = (new Array(11)).join(' ');

  return !!data && (rightAlign(title) + formatData(data));

  function rightAlign(text) {
    return (PADDING + text + ' ').slice(-PADDING.length);
  }

  function formatData(data) {
    return Array.isArray(data) ? data.join('\n' + PADDING) : data;
  }
}