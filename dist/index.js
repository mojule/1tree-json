'use strict';

var is = require('@mojule/is');
var TreeFactory = require('@mojule/tree').Factory;
var plugins = require('./plugins');

var Tree = TreeFactory(plugins);

var JsonTree = function JsonTree(value) {
  if (is.undefined(value)) throw new Error('JsonTree requires a raw node, value, or valid JSON object');

  if (Tree.isValue(value) || Tree.isNode(value)) return Tree(value);

  return Tree.fromJson(value);
};

Object.assign(JsonTree, Tree);

module.exports = JsonTree;