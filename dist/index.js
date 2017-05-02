'use strict';

var is = require('@mojule/is');
var TreeFactory = require('@mojule/tree').Factory;
var FactoryFactory = require('@mojule/tree').FactoryFactory;
var defaultPlugins = require('./plugins');
var Factory = FactoryFactory(TreeFactory, defaultPlugins);
var JsonTree = Factory();

Object.assign(JsonTree, { Factory: Factory });

module.exports = JsonTree;