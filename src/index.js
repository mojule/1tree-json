'use strict'

const Tree = require( '1tree' )
const T = require( 'mtype' )

const t = T()

const valueTypes = [ 'string', 'number', 'boolean' ]

const toNode = ( jsonObj, parent ) => {
  const create = parent ? parent.createNode : Tree.createRoot

  const nodeType = t.of( jsonObj )
  const value = { nodeType }

  if( valueTypes.includes( nodeType ) )
    value.nodeValue = jsonObj

  const node = create( value )

  if( nodeType === 'array' ){
    jsonObj.forEach( el => {
      node.append( toNode( el, node ) )
    })
  } else if( nodeType === 'object' ){
    const propertyNames = Object.keys( jsonObj )

    propertyNames.forEach( name => {
      const nodeValue = {
        nodeType: 'nameValue',
        nodeValue: name
      }

      const nameValueNode = node.createNode( nodeValue )
      const propertyValue = jsonObj[ name ]
      const valueNode = toNode( propertyValue, nameValueNode )

      nameValueNode.append( valueNode )
      node.append( nameValueNode )
    })
  }

  return node
}

const toTree = jsonObj => toNode( jsonObj, null )

const toJson = tree => {
  const value = tree.value()
  const nodeType = value.nodeType

  if( nodeType === 'null' ) return null

  if( valueTypes.includes( nodeType ) )
    return value.nodeValue

  if( nodeType === 'array' )
    return tree.getChildren().map( toJson )

  if( nodeType === 'object' ){
    const obj = {}

    tree.getChildren().forEach( nameValueNode => {
      const value = nameValueNode.value()
      const propertyName = value.nodeValue
      const propertyValue = toJson( nameValueNode.firstChild() )

      obj[ propertyName ] = propertyValue
    })

    return obj
  }

  throw new Error( 'Unexpected node' )
}

module.exports = { toTree, toJson }
