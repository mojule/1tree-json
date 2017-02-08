'use strict';

var typenames = require('../typenames');

var valueTypes = typenames.valueTypes;


var toJsonPlugin = function toJsonPlugin(fn) {
  var toJson = function toJson(fn, node) {
    var nodeType = fn.nodeType(fn, node);

    if (nodeType === 'null') return null;

    if (valueTypes.includes(nodeType)) {
      var value = fn.value(node);

      return value.nodeValue;
    }

    if (nodeType === 'array') {
      var children = fn.getChildren(node);

      return children.map(function (childNode) {
        return toJson(fn, childNode);
      });
    }

    if (nodeType === 'object') {
      var _children = fn.getChildren(node);

      return _children.reduce(function (result, nameValueNode) {
        var value = fn.value(nameValueNode);
        var propertyName = value.propertyName;

        var propertyValue = toJson(fn, nameValueNode);

        result[propertyName] = propertyValue;

        return result;
      }, {});
    }

    throw new Error('Unexpected node');
  };

  toJson.def = {
    argTypes: ['fn', 'node'],
    returnType: 'any',
    requires: ['nodeType', 'value', 'getChildren'],
    categories: ['meta', 'plugin']
  };

  return Object.assign(fn, { toJson: toJson });
};

module.exports = toJsonPlugin;