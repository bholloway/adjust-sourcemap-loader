'use strict';

var path = require('path'),
    fs   = require('fs');

/**
 * Codec for relative paths with respect to the context of the file being compiled
 * @type {{name:string, decode: function, encode: function, root: function}}
 */
module.exports = {
  name  : 'source-relative',
  decode: decode,
  encode: encode,
  root  : root
};

function decode(relative) {
  /* jshint validthis:true */
  if (!path.isAbsolute(relative)) {
    var base    = this.context,
        absFile = path.normalize(path.join(base, relative));
    return absFile && fs.existsSync(absFile) && fs.statSync(absFile).isFile() && absFile;
  }
}

function encode(absolute) {
  /* jshint validthis:true */
  return path.relative(this.context, absolute);
}

function root() {
  /* jshint validthis:true */
  return this.context;
}