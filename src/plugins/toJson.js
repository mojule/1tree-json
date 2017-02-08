'use strict'

const typenames = require( '../typenames' )

const { valueTypes } = typenames

const toJsonPlugin = fn => {
  const toJson = ( fn, node ) => {
    const nodeType = fn.nodeType( fn, node )

    if( nodeType === 'null' )
      return null

    if( valueTypes.includes( nodeType ) ){
      const value = fn.value( node )

      return value.nodeValue
    }

    if( nodeType === 'array' ){
      const children = fn.getChildren( node )

      return children.map( childNode => toJson( fn, childNode ) )
    }

    if( nodeType === 'object' ){
      const children = fn.getChildren( node )

      return children.reduce( ( result, nameValueNode ) => {
        const value = fn.value( nameValueNode )
        const { propertyName } = value
        const propertyValue = toJson( fn, nameValueNode )

        result[ propertyName ] = propertyValue

        return result
      }, {})
    }

    throw new Error( 'Unexpected node' )
  }

  toJson.def = {
    argTypes: [ 'fn', 'node' ],
    returnType: 'any',
    requires: [ 'nodeType', 'value', 'getChildren' ],
    categories: [ 'meta', 'plugin' ]
  }

  return Object.assign( fn, { toJson } )
}

module.exports = toJsonPlugin