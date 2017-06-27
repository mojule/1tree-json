'use strict'

const is = require( '@mojule/is' )
const nodeTypes = require( '../nodeTypes' )

const { valueTypes } = nodeTypes

const unnamedProperty = 'New property '

const toJson = ({ api }) => {
  api.toJson = () => {
    const { nodeType } = api

    if( nodeType === 'null' )
      return null

    if( valueTypes.includes( nodeType ) )
      return api.nodeValue

    if( nodeType === 'array' )
      return api.childNodes.toArray().map( child => child.toJson() )

    if( nodeType === 'object' ){
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
