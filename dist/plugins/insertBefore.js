'use strict';

var T = require('mtype');

var t = T();
var defaultPropertyName = 'New property ';

var insertBeforePlugin = function insertBeforePlugin(fn) {
  var originalInsertBefore = fn.insertBefore;

  var insertBefore = function insertBefore(fn, root, parentNode, childNode, referenceNode) {
    var parentNodeType = fn.nodeType(fn, parentNode);

    if (parentNodeType === 'object') {
      (function () {
        var value = fn.value(childNode);
        var propertyName = value.propertyName;

        var currentIndex = 0;

        var setPropertyName = function setPropertyName() {
          propertyName = defaultPropertyName + currentIndex;

          value.propertyName = propertyName;
          fn.value(childNode, value);

          currentIndex++;
        };

        if (!t.is(propertyName, 'string') || propertyName.length === 0) {
          setPropertyName();

          while (fn.hasProperty(fn, parentNode, propertyName)) {
            setPropertyName();
          }
        }
      })();
    }

    return originalInsertBefore(fn, root, parentNode, childNode, referenceNode);
  };

  insertBefore.def = originalInsertBefore.def;

  insertBefore.def.requires.push('hasProperty');

  return Object.assign(fn, { insertBefore: insertBefore });
};

module.exports = insertBeforePlugin;