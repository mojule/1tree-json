'use strict';

var utils = require('@mojule/utils');
var typenames = require('../typenames');

var allTypes = typenames.allTypes;
var capitalizeFirstLetter = utils.capitalizeFirstLetter;


var typesPlugin = function typesPlugin(node) {
  return allTypes.reduce(function (types, typename) {
    var fname = 'is' + capitalizeFirstLetter(typename);

    types[fname] = function () {
      return node.nodeType() === typename;
    };

    return types;
  }, {});
};

module.exports = typesPlugin;