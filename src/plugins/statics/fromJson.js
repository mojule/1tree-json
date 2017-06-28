'use strict'

const is = require( '@mojule/is' )
const nodeNames = require( '../nodeNames' )

const { valueTypes } = nodeNames

const fromJson = ({ statics, Api }) => {
  statics.fromJson = ( data, propertyName ) => {
    const nodeName = is.of( data )
    const value = { nodeName }

    if( !is.undefined( propertyName ) )
      value.propertyName = propertyName

    if( valueTypes.includes( nodeName ) )
      value.nodeValue = data

    const node = Api( value )

    if( nodeName === 'array' ){
      data.forEach( item => {
        const childNode = Api.fromJson( item )

        node.appendChild( childNode )
      })
    } else if( nodeName === 'object' ){
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
