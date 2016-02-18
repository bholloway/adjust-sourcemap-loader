module.exports = [
  require('./webpack-protocol'),
  require('./webpack-bootstrap'),
  require('./bower-component'),
  require('./npm-module'),
  // insert more codecs above for any special characters in URIs
  require('./output-relative'),
  require('./project-relative'),
  require('./source-relative'),
  require('./absolute')
];