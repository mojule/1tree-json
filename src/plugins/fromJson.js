'use strict'

const is = require( '@mojule/is' )
const typenames = require( '../typenames' )

const { valueTypes } = typenames

const fromJsonPlugin = node => {
  const Node = rawNode => node({
    root: rawNode,
    node: rawNode,
    parent: null
  })

  const $fromJson = obj => {
    const nodeType = is.of( obj )
    const value = { nodeType }

    if( valueTypes.includes( nodeType ) )
      value.nodeValue = obj

    const raw = node.createNode( value )
    const jsonNode = Node( raw )

    if( nodeType === 'array' ){
      obj.forEach( item => {
        const childNode = node.fromJson( item )

        jsonNode.add( childNode )
      })
    } else if( nodeType === 'object' ){
      const propertyNames = Object.keys( obj )

      propertyNames.forEach( propertyName => {
        const propertyValue = obj[ propertyName ]
        const childNode = node.fromJson( propertyValue )

        childNode.assign( { propertyName } )

        jsonNode.add( childNode )
      })
    }

    return jsonNode
  }

  return { $fromJson }
}

module.exports = fromJsonPlugin
