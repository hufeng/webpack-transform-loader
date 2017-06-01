var loaderUtils = require('loader-utils');

module.exports = function(content) {
  //cacheable
  this.cacheable && this.cacheable();

  //get query params
  //default is true
  var query = loaderUtils.getOptions(this) || {};
  var enable = query.enable;
  if (enable == void 0) {
    enable = true;
  }

  //enable true, return origin content
  //enable false, return function
  return enable ? content : 'module.exports = function() {return null}';
};
