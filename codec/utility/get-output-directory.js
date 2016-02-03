'use strict';

var path = require('path'),
    fs   = require('fs');

var getContextDirectory = require('./get-context-directory');

function getOutputDirectory() {
  /* jshint validthis:true */
  var base    = (typeof this.options.output === 'object') && this.options.output.directory,
      absBase = !!base && path.resolve(getContextDirectory.call(this), base);
  return !!absBase && fs.existsSync(absBase) && fs.statSync(absBase).isDirectory() && absBase;
}

module.exports = getOutputDirectory;