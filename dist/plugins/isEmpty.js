'use strict';

var typenames = require('../typenames');

var containerTypes = typenames.containerTypes;


var isEmptyPlugin = function isEmptyPlugin(node) {
  var isEmpty = function isEmpty() {
    var nodeType = node.nodeType();

    return !containerTypes.includes(nodeType);
  };

  return { isEmpty: isEmpty };
};

module.exports = isEmptyPlugin;