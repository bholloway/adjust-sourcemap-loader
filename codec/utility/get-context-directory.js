'use strict';

var path = require('path');

function getContextDirectory(loader) {
  var context = (typeof loader.options === 'object') && loader.options.context;
  return !!context && path.resolve(context) || process.cwd();
}

module.exports = getContextDirectory;