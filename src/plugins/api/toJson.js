'use strict'

const is = require( '@mojule/is' )
const nodeNames = require( '../nodeNames' )

const { valueTypes } = nodeNames

const unnamedProperty = 'New property '

const toJson = ({ api }) => {
  api.toJson = () => {
    const { nodeName } = api

    if( nodeName === 'null' )
      return null

    if( valueTypes.includes( nodeName ) )
      return api.nodeValue

    if( nodeName === 'array' )
      return api.childNodes.toArray().map( child => child.toJson() )

    if( nodeName === 'object' ){
      const children = api.childNodes.toArray()

      let unnamedCount = 0

      return children.reduce( ( result, propertyNode ) => {
        let { propertyName } = propertyNode.value

        if( !is.string( propertyName ) ){
          propertyName = unnamedProperty + unnamedCount
          unnamedCount++
        }

        result[ propertyName ] = propertyNode.toJson()

        return result
      }, {})
    }

    throw new Error( 'Unexpected node' )
  }
}

module.exports = toJson
