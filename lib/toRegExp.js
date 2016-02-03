var regexParser = require('regex-parser');

var REGEXP = /\/[^\/]*\/\w*/;

/**
 * Parse the give value as a regular expression or give a pass-all expression where it is invalid
 * @param {RegExp|string|*} value An existing expression, or its string representation, or degenerate value
 * @returns {RegExp} The given expression or one matching the RegExp string else a pass-all expression
 */
function toRegExp(value) {
  return ((typeof value === 'object') && (typeof value.test === 'function') && value) ||
    ((typeof value === 'string') && REGEXP.test(value) && regexParser(value)) ||
    /[^]*/;
}

module.exports = toRegExp;