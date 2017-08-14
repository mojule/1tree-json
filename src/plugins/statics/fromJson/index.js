'use strict'

const is = require( '@mojule/is' )

const fromJson = ({ statics, core, Api }) => {
  const {
    NULL_NODE, STRING_NODE, NUMBER_NODE, BOOLEAN_NODE, ARRAY_NODE, OBJECT_NODE
  } = statics

  const valueTypes = [ STRING_NODE, NUMBER_NODE, BOOLEAN_NODE ]

  statics.fromJson = ( data, propertyName ) => {
    if( is.undefined( data ) )
      throw Error( 'Argument expected' )

    const name = is.of( data )
    const nodeType = core.nodeTypes[ name ]
    const value = { nodeType }

    if( !is.undefined( propertyName ) )
      value.propertyName = propertyName

    if( valueTypes.includes( nodeType ) )
      value.nodeValue = data

    const node = Api( value )

    if( nodeType === ARRAY_NODE ){
      data.forEach( item => {
        const childNode = Api.fromJson( item )

        node.appendChild( childNode )
      })
    } else if( nodeType === OBJECT_NODE ){
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
