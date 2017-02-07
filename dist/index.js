'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TreeFactory = require('1tree-factory');
var T = require('mtype');
var plugins = require('./plugins');

var valueTypes = ['string', 'number', 'boolean'];
var containerTypes = ['object', 'array'];

var t = T();

var Tree = TreeFactory.apply(undefined, _toConsumableArray(plugins));

var extendValue = function extendValue(node, value) {
  return node.value(Object.assign({}, node.value(), value));
};

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
      var propertyValue = jsonObj[name];
      var valueNode = toNode(propertyValue, node);

      extendValue(valueNode, { propertyName: name });

      node.append(valueNode);
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

  if (nodeType === 'object') return tree.getChildren().reduce(function (result, nameValueNode) {
    var value = nameValueNode.value();
    var propertyName = value.propertyName;

    var propertyValue = toJson(nameValueNode);

    result[propertyName] = propertyValue;

    return result;
  }, {});

  throw new Error('Unexpected node');
};

module.exports = { toTree: toTree, toJson: toJson };