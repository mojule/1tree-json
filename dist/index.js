'use strict';

var is = require('@mojule/is');
var TreeFactory = require('@mojule/tree').Factory;
var plugins = require('./plugins');

var Tree = TreeFactory(plugins);

var isValue = function isValue(value) {
  return is.object(value) && is.string(value.nodeType);
};

var JsonTree = function JsonTree(value) {
  if (is.undefined(value)) throw new Error('JsonTree requires a raw node, value, or valid JSON object');

  if (isValue(value) || Tree.isNode(value)) return Tree(value);

  // need better handling for statics!
  return Tree({}).fromJson(value);
};

module.exports = JsonTree;