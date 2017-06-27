'use strict'

const is = require( '@mojule/is' )
const nodeTypes = require( '../nodeTypes' )

const { valueTypes } = nodeTypes

const fromJson = ({ statics, Api }) => {
  statics.fromJson = ( data, propertyName ) => {
    const nodeType = is.of( data )
    const value = { nodeType }

    if( !is.undefined( propertyName ) )
      value.propertyName = propertyName

    if( valueTypes.includes( nodeType ) )
      value.nodeValue = data

    const node = Api( value )

    if( nodeType === 'array' ){
      data.forEach( item => {
        const childNode = Api.fromJson( item )

        node.appendChild( childNode )
      })
    } else if( nodeType === 'object' ){
      const propertyNames = Object.keys( data )

      propertyNames.forEach( propertyName => {
        const propertyValue = data[ propertyName ]
        const childNode = Api.fromJson( propertyValue, propertyName )

        node.appendChild( childNode )
      })
    }

    return node
  }
}

module.exports = fromJson
