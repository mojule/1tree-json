'use strict'

const valueTypes = [ 'string', 'number', 'boolean' ]
const containerTypes = [ 'object', 'array' ]
const allTypes = valueTypes.concat( containerTypes ).concat( [ 'null' ] )

module.exports = { valueTypes, containerTypes, allTypes }
