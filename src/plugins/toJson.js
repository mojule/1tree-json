'use strict'

const is = require( '@mojule/is' )

const typenames = require( '../typenames' )

const { valueTypes } = typenames

const unnamedProperty = 'New property '

const toJsonPlugin = node => {
  const toJson = () => {
    const nodeType = node.nodeType()

    if( nodeType === 'null' )
      return null

    if( valueTypes.includes( nodeType ) ){
      return node.getValue( 'nodeValue' )
    }

    if( nodeType === 'array' ){
      const children = node.getChildren()

      return children.map( childNode => childNode.toJson() )
    }

    if( nodeType === 'object' ){
      const children = node.getChildren()

      let unnamedCount = 0

      return children.reduce( ( result, property ) => {
        let propertyName = property.getValue( 'propertyName' )

        if( !is.string( propertyName ) ){
          propertyName = unnamedProperty + unnamedCount
          unnamedCount++
        }

        result[ propertyName ] = property.toJson()

        return result
      }, {})
    }

    throw new Error( 'Unexpected node' )
  }

  return { toJson }
}

module.exports = toJsonPlugin
