'use strict';

var assign   = require('lodash.assign'),
    defaults = require('lodash.defaults');

var debugMessage      = require('./debug-message'),
    toRegExp          = require('./to-reg-exp'),
    throwErrors       = require('./throw-errors'),
    decodeSourcesWith = require('./decode-sources-with'),
    locateRootWith    = require('./locate-root-with'),
    encodeSourcesWith = require('./encode-sources-with'),
    reduceCodecs      = require('./reduce-codecs');

const CODECS = require('../../codec');

/**
 * Process the given source-map per the given options.
 * @param {{resourcePath:string, context:string, output:{path:string}}} context A loader or compilation
 * @param {{debug:boolean, format:string|boolean, root:string, codecs:object}} options Processing options
 * @param {object|string} sourceMapOrSource An incoming source-map or single source path
 * @returns {undefined|object|string} An amended source-map or source path else undefined
 */
function process(context, options, sourceMapOrSource) {

  // default options
  defaults(options, {
    debug : false,
    format: false,
    root  : false,
    codecs: []
  });

  // prefer codecs from options, else from internal library
  var codecs = defaults([].concat(options.codecs).reduce(reduceCodecs, {}), CODECS);

  // determine what is present
  var inputMap     = !!sourceMapOrSource && (typeof sourceMapOrSource === 'object') && sourceMapOrSource,
      inputPath    = (typeof sourceMapOrSource === 'string') && sourceMapOrSource,
      inputSources = inputMap && inputMap.sources || inputPath && [inputPath];

  // what we need to produce
  var absoluteSources,
      outputSources,
      outputRoot,
      outputMap;

  if (inputSources) {

    // decode each source with the first valid codec
    absoluteSources = inputSources
      .map(decodeSourcesWith.call(context, codecs))

    // check for decode errors
    throwErrors(context.resourcePath, absoluteSources);

    // output map is a copy unless absent or we are removing
    outputMap = (!inputMap || (options.format === 'remove')) ? undefined : assign({}, inputMap);

    // some change in format
    if (options.format) {

      // use the encoder where specified in 'format'
      outputSources = absoluteSources
        .map(encodeSourcesWith.call(context, codecs[options.format]));

      outputRoot = !!options.root && locateRootWith.call(context, codecs[options.format])() || undefined;

      // check for encode errors
      throwErrors(context.resourcePath, outputSources.concat(outputRoot));

      // commit the change
      if (outputMap) {
        outputMap.sources = outputSources;
        outputMap.sourceRoot = outputRoot;
      }
    }
  }

  // debugging information
  var isDebug = toRegExp(options.debug).test(context.resourcePath);
  if (isDebug) {
    console.log(debugMessage(context, {
      input   : inputSources,
      absolute: absoluteSources,
      output  : outputSources,
      root    : outputRoot
    }));
  }

  // complete
  return inputMap ? outputMap : outputSources[0];
}

module.exports = process;