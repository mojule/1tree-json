'use strict';

var T = require('mtype');
var typenames = require('../typenames');
var extendValue = require('../extendValue');

var valueTypes = typenames.valueTypes;


var t = T();

var fromJsonPlugin = function fromJsonPlugin(fn) {
  var fromJson = function fromJson(fn, jsonObj) {
    var nodeType = t.of(jsonObj);
    var value = { nodeType: nodeType };

    if (valueTypes.includes(nodeType)) value.nodeValue = jsonObj;

    var node = fn.createNode(value);

    if (nodeType === 'array') {
      jsonObj.forEach(function (el) {
        var childNode = fromJson(fn, el);

        /*
          unsafe child append - but it's OK because this tree type is standard
          value: object, children: array
        */
        node.children.push(childNode);
      });
    } else if (nodeType === 'object') {
      var propertyNames = Object.keys(jsonObj);

      propertyNames.forEach(function (name) {
        var propertyValue = jsonObj[name];
        var valueNode = fromJson(fn, propertyValue);

        extendValue(fn, valueNode, { propertyName: name });

        node.children.push(valueNode);
      });
    }

    return node;
  };

  fromJson.def = {
    argTypes: ['fn', 'any'],
    returnType: 'node',
    requires: ['createNode'],
    categories: ['meta', 'plugin']
  };

  Object.assign(fn, { fromJson: fromJson });
};

module.exports = fromJsonPlugin;