'use strict'

const extendValue = ( fn, node, value ) => {
  const existingValue = fn.value( node )
  const newValue = Object.assign( {}, existingValue, value )
  fn.value( node, newValue )
}

module.exports = extendValue
