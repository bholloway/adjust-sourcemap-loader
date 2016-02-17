'use strict';

var path           = require('path'),
    fs             = require('fs'),
    bowerDirectory = require('bower-directory');

var getContextDirectory = require('./utility/get-context-directory');

/**
 * Codec for relative paths with respect to the context directory, preceded by a webpack:// protocol
 * @type {{name:string, decode: function, encode: function, root: function}}
 */
module.exports = {
  name  : 'bower-component',
  decode: decode,
  encode: encode,
  root  : getContextDirectory
};

/**
 * Decode the given uri.
 * @this {{options: object}} A loader or compilation
 * @returns {boolean|string} False where unmatched else the decoded path
 */
function decode(uri) {
  /* jshint validthis:true */
  var analysis = /^([\w-]+)\s+\(bower component\)$/.exec(uri);
  if (analysis) {
    var moduleName = analysis[1],
        basePath   = getContextDirectory.call(this),
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

/**
 * Encode the given file path.
 * @throws Error Encoding is not supported
 * @this {{options: object}} A loader or compilation
 */
function encode() {
  throw new Error('Codec does not support encoding');
}