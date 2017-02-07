'use strict'

const TreeFactory = require( '1tree-factory' )
const T = require( 'mtype' )
const plugins = require( './plugins' )

const valueTypes = [ 'string', 'number', 'boolean' ]
const containerTypes = [ 'object', 'array' ]

const t = T()

const Tree = TreeFactory( ...plugins )

const extendValue = ( node, value ) =>
  node.value( Object.assign( {}, node.value(), value ) )

const toNode = ( jsonObj, parent ) => {
  const create = parent ? parent.createNode : Tree.createRoot

  const nodeType = t.of( jsonObj )
  const value = { nodeType }

  if( valueTypes.includes( nodeType ) )
    value.nodeValue = jsonObj

  const node = create( value )

  if( nodeType === 'array' ){
    jsonObj.forEach( ( el ) => {
      node.append( toNode( el, node ) )
    })
  } else if( nodeType === 'object' ){
    const propertyNames = Object.keys( jsonObj )

    propertyNames.forEach( name => {
      const propertyValue = jsonObj[ name ]
      const valueNode = toNode( propertyValue, node )

      extendValue( valueNode, { propertyName: name })

      node.append( valueNode )
    })
  }

  return node
}

const toTree = jsonObj => toNode( jsonObj, null )

const toJson = tree => {
  const value = tree.value()
  const nodeType = value.nodeType

  if( nodeType === 'null' )
    return null

  if( valueTypes.includes( nodeType ) )
    return value.nodeValue

  if( nodeType === 'array' )
    return tree.getChildren().map( toJson )

  if( nodeType === 'object' )
    return tree.getChildren().reduce( ( result, nameValueNode ) => {
      const value = nameValueNode.value()
      const { propertyName } = value
      const propertyValue = toJson( nameValueNode )

      result[ propertyName ] = propertyValue

      return result
    }, {} )

  throw new Error( 'Unexpected node' )
}

module.exports = { toTree, toJson }
