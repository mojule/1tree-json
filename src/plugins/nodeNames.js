'use strict'

const valueTypes = [ 'string', 'number', 'boolean' ]
const emptyTypes = valueTypes.concat( [ 'null' ] )
const containerTypes = [ 'object', 'array' ]
const allTypes = emptyTypes.concat( containerTypes )

module.exports = { valueTypes, emptyTypes, containerTypes, allTypes }
