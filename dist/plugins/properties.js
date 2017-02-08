'use strict';

//replace with fn.isObject, isString etc.

var isObjectNode = function isObjectNode(fn, node) {
  var nodeType = fn.nodeType(fn, node);

  return nodeType === 'object';
};

var enforceObject = function enforceObject(fn, node, fname) {
  if (!isObjectNode(fn, node)) throw new Error(fname + ' can only be called on an object node');
};

var propertiesPlugin = function propertiesPlugin(fn) {
  var getProperty = function getProperty(fn, node, propertyName) {
    enforceObject(fn, node, 'getProperty');

    var children = fn.getChildren(node);

    var property = children.find(function (siblingNode) {
      var siblingValue = fn.value(siblingNode);
      var siblingPropertyName = siblingValue.propertyName;

      return siblingPropertyName === propertyName;
    });

    return property;
  };

  getProperty.def = {
    argTypes: ['fn', 'node', 'string'],
    returnType: 'node',
    requires: ['getChildren', 'value'],
    categories: ['meta', 'plugin']
  };

  var setProperty = function setProperty(fn, root, parentNode, childNode, propertyName) {
    enforceObject(fn, parentNode, 'setProperty');

    var existing = fn.getProperty(fn, parentNode, propertyName);

    var childNodeValue = fn.value(childNode);
    childNodeValue.propertyName = propertyName;
    fn.value(childNode, childNodeValue);

    if (existing) {
      fn.insertBefore(fn, root, parentNode, childNode, existing);

      existing.remove();

      return childNode;
    }

    return fn.append(fn, root, parentNode, childNode);
  };

  setProperty.def = {
    argTypes: ['fn', 'rootNode', 'node', 'node', 'string'],
    returnType: 'node',
    requires: ['getProperty', 'value', 'insertBefore', 'append'],
    categories: ['meta', 'plugin']
  };

  var hasProperty = function hasProperty(fn, node, propertyName) {
    enforceObject(fn, node, 'hasProperty');

    var property = fn.getProperty(fn, node, propertyName);

    return !!property;
  };

  hasProperty.def = {
    argTypes: ['fn', 'node', 'string'],
    returnType: 'boolean',
    requires: ['getProperty'],
    categories: ['meta', 'plugin']
  };

  var removeProperty = function removeProperty(fn, root, node, propertyName) {
    enforceObject(fn, node, 'removeProperty');

    var property = fn.getProperty(fn, node, propertyName);

    if (!property) throw new Error('Object node does not have a property "' + propertyName + '"');

    return fn.remove(fn, root, property);
  };

  removeProperty.def = {
    argTypes: ['fn', 'rootNode', 'node', 'string'],
    returnType: 'node',
    requires: ['getProperty', 'remove'],
    categories: ['meta', 'plugin']
  };

  var keys = function keys(fn, node) {
    enforceObject(fn, node, 'keys');

    var children = fn.getChildren(node);

    var keys = children.map(function (childNode) {
      var value = fn.value(childNode);

      return value.propertyName;
    });

    return keys;
  };

  keys.def = {
    argTypes: ['fn', 'node'],
    returnType: '[string]',
    requires: ['getChildren', 'value'],
    categories: ['meta', 'plugin']
  };

  var values = function values(fn, node) {
    enforceObject(fn, node, 'values');

    var children = fn.getChildren(node);

    var values = children.map(function (childNode) {
      var value = fn.value(childNode);

      return value.nodeValue;
    });

    return values;
  };

  values.def = {
    argTypes: ['fn', 'node'],
    returnType: '[any]',
    requires: ['getChildren', 'value'],
    categories: ['meta', 'plugin']
  };

  var renameProperty = function renameProperty(fn, node, propertyName, newPropertyName) {
    enforceObject(fn, node, 'renameProperty');

    var property = fn.getProperty(fn, node, propertyName);

    if (!property) throw new Error('Object node does not have a property "' + propertyName + '"');

    var propertyValue = fn.value(property);
    propertyValue.propertyName = newPropertyName;
    fn.value(property, propertyValue);

    return property;
  };

  renameProperty.def = {
    argTypes: ['fn', 'node', 'string', 'string'],
    returnType: 'node',
    requires: ['getProperty', 'value'],
    categories: ['meta', 'plugin']
  };

  return Object.assign(fn, {
    getProperty: getProperty, setProperty: setProperty, hasProperty: hasProperty, removeProperty: removeProperty, keys: keys, values: values,
    renameProperty: renameProperty
  });
};

module.exports = propertiesPlugin;