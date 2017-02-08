'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TreeFactory = require('1tree-factory');
var plugins = require('./plugins');
var createTreePlugin = require('./plugins/createTree');

var JsonTree = TreeFactory.apply(undefined, _toConsumableArray(plugins));

// added afterwards to ensure createTree plugin already exists, as it wraps it
JsonTree.plugin(createTreePlugin);

module.exports = JsonTree;