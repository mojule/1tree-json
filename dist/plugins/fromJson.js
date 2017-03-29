'use strict';

var is = require('@mojule/is');
var typenames = require('../typenames');

var valueTypes = typenames.valueTypes;


var fromJsonPlugin = function fromJsonPlugin(node) {
  var Node = function Node(rawNode) {
    return node({
      root: rawNode,
      node: rawNode,
      parent: null
    });
  };

  var fromJson = function fromJson(obj) {
    var nodeType = is.of(obj);
    var value = { nodeType: nodeType };

    if (valueTypes.includes(nodeType)) value.nodeValue = obj;

    var raw = node.createNode(value);
    var jsonNode = Node(raw);

    if (nodeType === 'array') {
      obj.forEach(function (item) {
        var childNode = fromJson(item);

        jsonNode.add(childNode);
      });
    } else if (nodeType === 'object') {
      var propertyNames = Object.keys(obj);

      propertyNames.forEach(function (propertyName) {
        var propertyValue = obj[propertyName];
        var childNode = fromJson(propertyValue);

        childNode.assign({ propertyName: propertyName });

        jsonNode.add(childNode);
      });
    }

    return jsonNode;
  };

  return { fromJson: fromJson };
};

module.exports = fromJsonPlugin;