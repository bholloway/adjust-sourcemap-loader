'use strict';

function moduleFilenameTemplate(options) {

  return function templateFn(parameters) {
    /*
     {
     identifier: identifier,
     shortIdentifier: shortIdentifier,
     resource: resource,
     resourcePath: resourcePath,
     absoluteResourcePath: absoluteResourcePath,
     allLoaders: allLoaders,
     query: query,
     moduleId: moduleId,
     hash: hash
     }
     */

    // IMPORTANT - options.debug must be overriden false
  };
}

module.exports = moduleFilenameTemplate;