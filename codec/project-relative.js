'use strict';

var path = require('path'),
    fs   = require('fs');

var getContextDirectory = require('./utility/get-context-directory');

/**
 * Codec for relative paths with respect to the context directory
 * @type {{name:string, decode: function, encode: function, root: function}}
 */
module.exports = {
  name  : 'project-relative',
  decode: decode,
  encode: encode,
  root  : getContextDirectory
};

function decode(relative) {
  /* jshint validthis:true */
  if (!path.isAbsolute(relative)) {
    var base    = getContextDirectory.call(this),
        absFile = path.normalize(path.join(base, relative));
    return absFile && fs.existsSync(absFile) && fs.statSync(absFile).isFile() && absFile;
  }
}

function encode(absolute) {
  /* jshint validthis:true */
  var base = getContextDirectory.call(this);
  if (!base) {
    throw new Error('Cannot locate the Webpack output directory');
  }
  else {
    return path.relative(base, absolute);
  }
}

