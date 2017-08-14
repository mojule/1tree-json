'use strict'

const is = require( '@mojule/is' )

const unnamedProperty = 'New property '

const toJson = ({ api, Api }) => {
  api.toJson = () => {
    if( api.isNullNode() )
      return null

    if( api.isValueNode() )
      return api.nodeValue

    if( api.isArrayNode() )
      return api.childNodes.toArray().map( child => child.toJson() )

    if( api.isObjectNode() ){
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
