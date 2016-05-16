'use strict';

var fs   = require('fs'),
    path = require('path');

var usage = {},
    cache = {};

/**
 * Perform <code>path.relative()</code> but try to detect and correct sym-linked node modules.
 * @param {string} from The base path
 * @param {string} to The full path
 */
function enhancedRelative(from, to) {

  // cache miss
  var isCached = (to in cache);
  if (!isCached) {
    var relative    = path.relative(from, to),
        isOutside   = /^\.{2}/.test(relative),
        packageInfo = isOutside && packageOf(to);

    // could be a linked project in node_modules of the 'from' directory
    if (packageInfo) {
      var packagePath  = findLinkedWithinDirectory(from, packageInfo.name),
          resourcePath = !!packagePath && path.join(packagePath, packageInfo.path),
          isPresent    = !!resourcePath && fs.existsSync(resourcePath) && fs.statSync(resourcePath).isFile();

      // append a hash to avoid path collision
      if (isPresent) {
        relative = path.relative(from, resourcePath);
      }
    }

    // populate the cache
    usage[to] = 0;
    cache[to] = relative;
  }

  // add suffix on more than one usage (post increment)
  var suffix = (usage[to]++) ? ('#' + usage[to]) : '';

  // read from cache
  return cache[to] + suffix;
}

module.exports = enhancedRelative;

/**
 * Get the package name of the given candidate file by searching upwards until a package.json is found.
 * May result in a long search if package.json is not present.
 * @param {string} candidate A file that is contained within a package
 * @param {string} [directory] Optional directory to look in, or use candidate directory where omitted
 * @returns {boolean|{name:string, path:string}} The particulars of the package else false where not found
 */
function packageOf(candidate, directory) {

  // ensure directory
  directory = directory || path.dirname(candidate);

  // check for package.json
  var isDirectory = fs.existsSync(directory) && fs.statSync(directory).isDirectory(),
      packageFile = !!isDirectory && path.join(directory, 'package.json'),
      isPackage   = !!packageFile && fs.existsSync(packageFile);
  if (isPackage) {
    var name          = require(packageFile).name,
        remainingPath = path.relative(directory, candidate);
    return {
      name: name,
      path: remainingPath
    };
  }
  // otherwise recurse upwards
  else if (isDirectory) {
    var upOneDirectory = path.normalize(path.join(directory, '..'));
    return packageOf(candidate, upOneDirectory);
  }
  // finally fail
  else {
    return false;
  }
}

/**
 * Find the given package linked somewhere in the given base directory.
 * Presumes that the package name will be identical to its node modules directory name.
 * @param {string} basePath A directory that may have node modules
 * @param {string} packageName A package name
 * @returns {boolean|string} The linked package within the basePath else false on not found
 */
function findLinkedWithinDirectory(basePath, packageName) {
  var modulesPath    = path.join(basePath, 'node_modules'),
      hasNodeModules = fs.existsSync(modulesPath) && fs.statSync(modulesPath).isDirectory(),
      names          = !!hasNodeModules && fs.readdirSync(modulesPath);
  return names && names.reduce(eachName, false);

  function eachName(reduced, subdirectory) {
    if (reduced) {
      return reduced;
    }
    else {
      var modulePath = path.join(modulesPath, subdirectory);
      if (subdirectory === packageName) {
        return modulePath;
      }
      else {
        return fs.statSync(modulePath).isSymbolicLink() && findLinkedWithinDirectory(modulePath, packageName);
      }
    }
  }
}