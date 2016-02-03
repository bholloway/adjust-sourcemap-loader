'use strict';

var path           = require('path'),
    fs             = require('fs'),
    bowerDirectory = require('bower-directory');

var getContextDirectory = require('./utility/get-context-directory');

/**
 * Codec for relative paths with respect to the context directory, preceded by a webpack:// protocol
 * @type {{decode: decode, encode: encode}}
 */
module.exports = {
  decode: decode,
  encode: encode
};

function decode(uri) {
  /* jshint validthis:true */
  var analysis = /^([\w-]+)\s+\(bower component\)$/.exec(uri);
  if (analysis) {
    var moduleName = analysis[1],
        basePath   = getContextDirectory(),
        bowerDir   = bowerDirectory.sync({cwd: basePath}),
        moduleJson = path.resolve(bowerDir, moduleName, 'bower.json'),
        isValid    = fs.existsSync(moduleJson) && fs.statSync(moduleJson).isFile();
    if (!isValid) {
      throw new Error('Bower module "' + moduleName + '" cannot be located in :' + bowerDir);
    }
    else {
      var moduleMain = [].concat(require(moduleJson).main);
      if ((moduleMain.length !== 1) || (typeof moduleMain[0] !== 'string')) {
        throw new Error('Unsupported "main" field in bower.json for package "' + moduleName + '"');
      }
      else {
        return path.resolve(bowerDir, moduleName, moduleMain);
      }
    }
  }
}

function encode() {
  throw new Error('Codec does not support encoding');
}