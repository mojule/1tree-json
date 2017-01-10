'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Tree = require('1tree');
var T = require('mtype');

var t = T();

var valueTypes = ['string', 'number', 'boolean'];

var toNode = function toNode(jsonObj, parent) {
  var create = parent ? parent.createNode : Tree.createRoot;

  var nodeType = t.of(jsonObj);
  var value = { nodeType: nodeType };

  if (valueTypes.includes(nodeType)) value.nodeValue = jsonObj;

  var node = create(value);

  if (nodeType === 'array') {
    jsonObj.forEach(function (el) {
      node.append(toNode(el, node));
    });
  } else if (nodeType === 'object') {
    var propertyNames = Object.keys(jsonObj);

    propertyNames.forEach(function (name) {
      var nodeValue = {
        nodeType: 'nameValue',
        nodeValue: name
      };

      var nameValueNode = node.createNode(nodeValue);
      var propertyValue = jsonObj[name];
      var valueNode = toNode(propertyValue, nameValueNode);

      nameValueNode.append(valueNode);
      node.append(nameValueNode);
    });
  }

  return node;
};

var toTree = function toTree(jsonObj) {
  return toNode(jsonObj, null);
};

var toJson = function toJson(tree) {
  var value = tree.value();
  var nodeType = value.nodeType;

  if (nodeType === 'null') return null;

  if (valueTypes.includes(nodeType)) return value.nodeValue;

  if (nodeType === 'array') return tree.getChildren().map(toJson);

  if (nodeType === 'object') {
    var _ret = function () {
      var obj = {};

      tree.getChildren().forEach(function (nameValueNode) {
        var value = nameValueNode.value();
        var propertyName = value.nodeValue;
        var propertyValue = toJson(nameValueNode.firstChild());

        obj[propertyName] = propertyValue;
      });

      return {
        v: obj
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  throw new Error('Unexpected node');
};

module.exports = { toTree: toTree, toJson: toJson };