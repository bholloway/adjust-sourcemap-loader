'use strict';

var path = require('path'),
    fs   = require('fs');

var getContextDirectory = require('./get-context-directory');

function getOutputDirectory(loader) {
  var base    = (typeof loader.options.output === 'object') && loader.options.output.directory,
      absBase = !!base && path.resolve(getContextDirectory(loader), base);
  return !!absBase && fs.existsSync(absBase) && fs.statSync(absBase).isDirectory() && absBase;
}

module.exports = getOutputDirectory;