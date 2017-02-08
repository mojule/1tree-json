'use strict';

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

module.exports = slugPlugin;