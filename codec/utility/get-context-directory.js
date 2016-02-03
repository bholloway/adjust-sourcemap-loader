'use strict';

var path = require('path');

function getContextDirectory() {
  /* jshint validthis:true */
  var context = (typeof this.options === 'object') && this.options.context;
  return !!context && path.resolve(context) || process.cwd();
}

module.exports = getContextDirectory;