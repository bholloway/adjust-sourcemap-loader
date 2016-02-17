'use strict';

var path = require('path');

/**
 * Infer the compilation context directory from options.
 * Relative paths are resolved against process.cwd().
 * @this {{options: object}} A loader or compilation
 * @returns {string} process.cwd() where not defined else the output path string
 */
function getContextDirectory() {
  /* jshint validthis:true */
  var context = (typeof this.options === 'object') && this.options.context;
  return !!context && path.resolve(context) || process.cwd();
}

module.exports = getContextDirectory;