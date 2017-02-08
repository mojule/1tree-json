'use strict';

var valueTypes = ['string', 'number', 'boolean'];
var containerTypes = ['object', 'array'];
var allTypes = valueTypes.concat(containerTypes).concat(['null']);

module.exports = { valueTypes: valueTypes, containerTypes: containerTypes, allTypes: allTypes };