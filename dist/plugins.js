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

var insertBeforePlugin = function insertBeforePlugin(fn) {
  var originalInsertBefore = fn.insertBefore;

  var insertBefore = function insertBefore(fn, root, parentNode, childNode, referenceNode) {
    var parentNodeType = fn.nodeType(fn, parentNode);

    if (parentNodeType === 'object') {
      (function () {
        var value = fn.value(childNode);
        var propertyName = value.propertyName;


        if (!t.is(propertyName, 'string') || propertyName.length === 0) throw new Error('When adding a child to an object, it must have a propertyName');

        var children = fn.getChildren(parentNode);

        var propertyNameAlreadyExists = children.some(function (siblingNode) {
          var siblingValue = fn.value(siblingNode);
          var siblingPropertyName = siblingValue.propertyName;

          return siblingPropertyName === propertyName;
        });

        if (propertyNameAlreadyExists) throw new Error('The property ' + propertyName + ' already exists');
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