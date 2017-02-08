'use strict';

var typenames = require('../typenames');

var containerTypes = typenames.containerTypes;


var isEmptyPlugin = function isEmptyPlugin(fn) {
  var isEmpty = function isEmpty(fn, node) {
    var nodeType = fn.nodeType(fn, node);

    return !containerTypes.includes(nodeType);
  };

  isEmpty.def = fn.isEmpty.def;

  return Object.assign(fn, { isEmpty: isEmpty });
};

module.exports = isEmptyPlugin;