'use strict'

const is = require( '@mojule/is' )
const TreeFactory = require( '@mojule/tree' ).Factory
const plugins = require( './plugins' )

const Tree = TreeFactory( plugins )

const JsonTree = value => {
  if( is.undefined( value ) )
    throw new Error( 'JsonTree requires a raw node, value, or valid JSON object' )

  if( Tree.isValue( value ) || Tree.isNode( value ) )
    return Tree( value )

  return Tree.fromJson( value )
}

Object.assign( JsonTree, Tree )

module.exports = JsonTree
