'use strict';

var is = require('@mojule/is');

var typenames = require('../typenames');

var valueTypes = typenames.valueTypes;


var unnamedProperty = 'New property ';

var toJsonPlugin = function toJsonPlugin(node) {
  var toJson = function toJson() {
    var nodeType = node.nodeType();

    if (nodeType === 'null') return null;

    if (valueTypes.includes(nodeType)) {
      return node.getValue('nodeValue');
    }

    if (nodeType === 'array') {
      var children = node.getChildren();

      return children.map(function (childNode) {
        return childNode.toJson();
      });
    }

    if (nodeType === 'object') {
      var _children = node.getChildren();

      var unnamedCount = 0;

      return _children.reduce(function (result, property) {
        var propertyName = property.getValue('propertyName');

        if (!is.string(propertyName)) {
          propertyName = unnamedProperty + unnamedCount;
          unnamedCount++;
        }

        result[propertyName] = property.toJson();

        return result;
      }, {});
    }

    throw new Error('Unexpected node');
  };

  return { toJson: toJson };
};

module.exports = toJsonPlugin;