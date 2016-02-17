'use strict';

var assign   = require('lodash.assign'),
    defaults = require('lodash.defaults');

var debug             = require('./debug'),
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
 * @param {object} sourceMap An incoming source-map
 * @returns {undefined|object} An amended source-map or else undefined
 */
function process(context, options, sourceMap) {

  // default options
  defaults(options, {
    debug : false,
    format: false,
    root  : false,
    codecs: []
  });

  // prefer codecs from options, else from internal library
  var codecs = defaults([].concat(options.codecs).reduce(reduceCodecs, {}), CODECS);

  // source-map present and will be carried through
  var absoluteSources,
      encodedSources,
      encodedRoot,
      outputMap;
  if (sourceMap) {

    // decode with the first valid codec
    absoluteSources = sourceMap.sources
      .map(decodeSourcesWith.call(context, codecs));

    // check for decode errors
    throwErrors(context.resourcePath, absoluteSources);

    // output map is a copy unless we are removing
    outputMap = (options.format === 'remove') ? undefined : assign({}, sourceMap);

    // some change in format
    if (!!options.format) {

      // use the encoder where specified in 'format'
      encodedRoot = !!options.root && locateRootWith.call(context, codecs[options.format])() || undefined;
      encodedSources = absoluteSources
        .map(encodeSourcesWith.call(context, codecs[options.format]));

      // check for encode errors
      throwErrors(context.resourcePath, encodedSources.concat(encodedRoot));

      // commit the change
      outputMap.sources = encodedSources;
      outputMap.sourceRoot = encodedRoot;
    }
  }

  // debugging information
  var isDebug = toRegExp(options.debug).test(context.resourcePath);
  if (isDebug) {
    var inputSources = sourceMap && sourceMap.sources;
    console.log(debug(context, inputSources, absoluteSources, encodedSources, encodedRoot));
  }

  // complete
  return outputMap;
}

module.exports = process;