/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

var loaderUtils = require('loader-utils'),
    camelcase   = require('camelcase'),
    assign      = require('lodash.assign'),
    defaults    = require('lodash.defaults');

var debug             = require('./lib/debug'),
    toRegExp          = require('./lib/toRegExp'),
    getError          = require('./lib/getError'),
    decodeSourcesWith = require('./lib/decodeSourcesWith'),
    encodeSourcesWith = require('./lib/encodeSourcesWith');

var PACKAGE_NAME = require('./package.json').name,
    CODECS       = {
      absolute       : require('./codec/absolute'),
      bowerComponent : require('./codec/bower-component'),
      fullyRelative  : require('./codec/fully-relative'),
      projectRelative: require('./codec/project-relative'),
      webpackProtocol: require('./codec/webpack-protocol')
    };

/**
 * Webpack loader that manipulates the source-map of a preceding loader.
 * @param {string} content The content
 * @param {object} sourceMap The source-map
 * @returns {string|String}
 */
function sourcemapSourcesLoader(content, sourceMap) {
  /* jshint validthis:true */

  // details of the file being processed
  //  we would normally use compilation.getPath(options.output.path) to get the most correct outputPath,
  //  however we need to match to the sass-loader and it does not do so
  var loader = this;

  // prefer loader query, else options object, else default values
  var options = defaults(loaderUtils.parseQuery(loader.query), loader.options[camelcase(PACKAGE_NAME)], {
    test  : null,
    debug : false,
    format: false,
    codecs: {}
  });

  // prefer codec from options, else from internal library
  var codecs = defaults({}, CODECS, options.codecs);

  // loader result is cacheable
  loader.cacheable();

  // source-map present and will be carried through
  var absoluteSources,
      encodedSources;
  if (sourceMap && (options.format !== 'remove')) {

    // decode with the first valid codec
    absoluteSources = sourceMap.sources
      .map(decodeSourcesWith.call(loader, codecs));

    // check for decode errors
    throwErrors(absoluteSources);

    // use the encoder where specified in 'format'
    encodedSources = !!options.format && absoluteSources
        .map(encodeSourcesWith.call(loader, options.codecs[options.format]));

    // check for encode errors
    throwErrors(encodedSources);

    // commit the change where valid
    if (!!encodedSources) {
      sourceMap.sources = encodedSources;
    }
  }

  // debugging information
  var isDebug = toRegExp(options.debug).test(loader.resourcePath);
  if (isDebug) {
    var inputSources = sourceMap && sourceMap.sources;
    console.log(debug(loader, inputSources, absoluteSources, encodedSources));
  }

  // need to use callback when there are multiple arguments
  loader.callback(null, content, sourceMap);

  /**
   * Where the given list is non-null and contains error instances then consolidate and throw
   * @throws Error
   * @param {null|Array} candidates A possible Array with possible error elements
   */
  function throwErrors(candidates) {
    var errors = !!candidates && candidates
        .filter(testIsError)
        .map(getMessage);

    var hasError = !!errors && errors.length;
    if (hasError) {
      throw getError('For resource:', loader.resourcePath, '\n', errors.join('\n'));
    }

    function testIsError(candidate) {
      return !!candidate && (typeof candidate === 'object') && (candidate instanceof Error);
    }

    function getMessage(error) {
      return error.message;
    }
  }
}

module.exports = assign(sourcemapSourcesLoader, CODECS);