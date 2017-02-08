'use strict';

var utils = require('mojule-utils');
var typenames = require('../typenames');

var allTypes = typenames.allTypes;
var capitalizeFirstLetter = utils.capitalizeFirstLetter;


var typesPlugin = function typesPlugin(fn) {
  allTypes.forEach(function (typename) {
    var fname = 'is' + capitalizeFirstLetter(typename);

    fn[fname] = function (fn, node) {
      var nodeType = fn.nodeType(fn, node);

      return nodeType === typename;
    };

    fn[fname].def = {
      argTypes: ['fn', 'node'],
      returnType: 'boolean',
      requires: ['nodeType'],
      categories: ['meta', 'plugin']
    };
  });

  return fn;
};

module.exports = typesPlugin;