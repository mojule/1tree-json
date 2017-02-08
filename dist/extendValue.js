'use strict';

var extendValue = function extendValue(fn, node, value) {
  var existingValue = fn.value(node);
  var newValue = Object.assign({}, existingValue, value);
  fn.value(node, newValue);
};

module.exports = extendValue;