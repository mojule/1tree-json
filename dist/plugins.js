'use strict';

var T = require('mtype');

var valueTypes = ['string', 'number', 'boolean'];
var containerTypes = ['object', 'array'];

var t = T();

var isEmptyPlugin = function isEmptyPlugin(fn) {
  var isEmpty = function isEmpty(fn, node) {
    var nodeType = fn.nodeType(fn, node);

    return !containerTypes.includes(nodeType);
  };

  isEmpty.def = fn.isEmpty.def;

  return Object.assign(fn, { isEmpty: isEmpty });
};

var defaultPropertyName = 'New property ';

var hasPropertyName = function hasPropertyName(fn, node, propertyName) {
  var children = fn.getChildren(node);

  var propertyNameAlreadyExists = children.some(function (siblingNode) {
    var siblingValue = fn.value(siblingNode);
    var siblingPropertyName = siblingValue.propertyName;

    return siblingPropertyName === propertyName;
  });

  return propertyNameAlreadyExists;
};

var insertBeforePlugin = function insertBeforePlugin(fn) {
  var originalInsertBefore = fn.insertBefore;

  var insertBefore = function insertBefore(fn, root, parentNode, childNode, referenceNode) {
    var parentNodeType = fn.nodeType(fn, parentNode);

    if (parentNodeType === 'object') {
      (function () {
        var value = fn.value(childNode);
        var propertyName = value.propertyName;

        var currentIndex = 0;

        var addPropertyName = function addPropertyName() {
          propertyName = defaultPropertyName + currentIndex;

          value.propertyName = propertyName;
          fn.value(childNode, value);

          currentIndex++;
        };

        if (!t.is(propertyName, 'string') || propertyName.length === 0) addPropertyName();

        while (hasPropertyName(fn, parentNode, propertyName)) {
          addPropertyName();
        }
      })();
    }
    return originalInsertBefore(fn, root, parentNode, childNode, referenceNode);
  };

  insertBefore.def = originalInsertBefore.def;

  return Object.assign(fn, { insertBefore: insertBefore });
};

var slugPlugin = function slugPlugin(fn) {
  var originalSlug = fn.slug;

  var slug = function slug(fn, root, node) {
    if (root === node) return '';

    var parent = fn.getParent(fn, root, node);
    var parentValue = fn.value(parent);
    var nodeType = parentValue.nodeType;


    if (nodeType === 'object') {
      var value = fn.value(node);
      var propertyName = value.propertyName;


      return propertyName;
    }

    return String(fn.index(fn, root, node));
  };

  slug.def = originalSlug.def;

  return Object.assign(fn, { slug: slug });
};

var plugins = [isEmptyPlugin, insertBeforePlugin, slugPlugin];

module.exports = plugins;