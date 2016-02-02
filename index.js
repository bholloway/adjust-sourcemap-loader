/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

var loaderUtils = require('loader-utils'),
    regexParser = require('regex-parser'),
    camelcase   = require('camelcase'),
    assign      = require('lodash.assign'),
    defaults    = require('lodash.defaults');

var PACKAGE_NAME = require('./package.json').name,
    REGEXP       = /\/[^\/]*\/\w*/,
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
    format: false
  });

  // loader result is cacheable
  loader.cacheable();

  // debugging information
  var isDebug = toRegExp(options.debug).test(loader.resourcePath);
  if (isDebug) {
    var message = [
      '',
      PACKAGE_NAME + ':',
      '  ' + loader.resourcePath,
      '   @ ' + loader.loaders.slice(loader.loaderIndex + 1).reverse().map(dotRequest).join('\n     '),
      '  => ' + (sourceMap ? sourceMap.sources : ['(source-map absent)']).join('\n     ')
    ].join('\n');

    console.log(message);
  }

  // source-map present
  if (sourceMap) {

    // TODO codec

    // need to use callback when there are multiple arguments
    loader.callback(null, content, sourceMap);
  }
  // source-map absent
  else {
    return content;
  }
}

module.exports = assign(sourcemapSourcesLoader, CODECS);

function toRegExp(value) {
  return ((typeof value === 'object') && (typeof value.test === 'function') && value) ||
    ((typeof value === 'string') && REGEXP.test(value) && regexParser(value)) ||
    /[^]*/;
}

function dotRequest(obj) {
  return obj.request;
}
