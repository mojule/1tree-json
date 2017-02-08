'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var typenames = require('../typenames');

var valueTypes = typenames.valueTypes;


var unnamedProperty = 'New property ';

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
      var _ret = function () {
        var children = fn.getChildren(node);

        var unnamedCount = 0;

        return {
          v: children.reduce(function (result, nameValueNode) {
            var value = fn.value(nameValueNode);
            var propertyName = value.propertyName;


            if (propertyName === undefined) {
              propertyName = unnamedProperty + unnamedCount;
              unnamedCount++;
            }

            var propertyValue = toJson(fn, nameValueNode);

            result[propertyName] = propertyValue;

            return result;
          }, {})
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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