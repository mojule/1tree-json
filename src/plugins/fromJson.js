'use strict'

const T = require( 'mtype' )
const typenames = require( '../typenames' )
const extendValue = require( '../extendValue' )

const { valueTypes } = typenames

const t = T()

const fromJsonPlugin = fn => {
  const fromJson = ( fn, jsonObj ) => {
    const nodeType = t.of( jsonObj )
    const value = { nodeType }

    if( valueTypes.includes( nodeType ) )
      value.nodeValue = jsonObj

    const node = fn.createNode( value )

    if( nodeType === 'array' ){
      jsonObj.forEach( ( el ) => {
        const childNode = fromJson( fn, el )

        /*
          unsafe child append - but it's OK because this tree type is standard
          value: object, children: array
        */
        node.children.push( childNode )
      })
    } else if( nodeType === 'object' ){
      const propertyNames = Object.keys( jsonObj )

      propertyNames.forEach( name => {
        const propertyValue = jsonObj[ name ]
        const valueNode = fromJson( fn, propertyValue )

        extendValue( fn, valueNode, { propertyName: name } )

        node.children.push( valueNode )
      })
    }

    return node
  }

  fromJson.def = {
    argTypes: [ 'fn', 'any' ],
    returnType: 'node',
    requires: [ 'createNode' ],
    categories: [ 'meta', 'plugin' ]
  }

  Object.assign( fn, { fromJson } )
}

module.exports = fromJsonPlugin
