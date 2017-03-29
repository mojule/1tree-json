'use strict';

var is = require('@mojule/is');

var propertiesPlugin = function propertiesPlugin(node) {
  // need to figure out a better way to do statics
  if (!is.null(node.state.node) && node.nodeType() !== 'object') return {};

  var getProperty = function getProperty(propertyName) {
    var children = node.getChildren();

    return children.find(function (child) {
      return child.getValue('propertyName') === propertyName;
    });
  };

  // add child and set its propertyName, or replace existing property
  var setProperty = function setProperty(propertyName, child) {
    if (!is.string(propertyName)) throw new Error('setProperty expects a propertyName string as first argument');

    var existing = node.getProperty(propertyName);

    if (existing) existing.remove();

    child.assign({ propertyName: propertyName });

    return node.add(child);
  };

  var hasProperty = function hasProperty(propertyName) {
    return !!node.getProperty(propertyName);
  };

  var removeProperty = function removeProperty(propertyName) {
    var existing = node.getProperty(propertyName);

    if (!existing) throw new Error('Object node does not have a property "' + propertyName + '"');

    return existing.remove();
  };

  var keys = function keys() {
    var children = node.getChildren();

    var keys = children.map(function (child) {
      return child.getValue('propertyName');
    });

    return keys;
  };

  var values = function values() {
    var children = node.getChildren();

    var values = children.map(function (child) {
      return child.getValue('nodeValue');
    });

    return values;
  };

  var renameProperty = function renameProperty(existingPropertyName, propertyName) {
    var existing = node.getProperty(existingPropertyName);

    if (!existing) throw new Error('Object node does not have a property "' + propertyName + '"');

    existing.assign({ propertyName: propertyName });

    return existing;
  };

  return {
    getProperty: getProperty, setProperty: setProperty, hasProperty: hasProperty, removeProperty: removeProperty, keys: keys, values: values,
    renameProperty: renameProperty
  };
};

module.exports = propertiesPlugin;