'use strict'

const is = require( '@mojule/is' )
const TreeFactory = require( '@mojule/tree' ).Factory
const plugins = require( './plugins' )

const Tree = TreeFactory( plugins )

const isValue = value => is.object( value ) && is.string( value.nodeType )

const JsonTree = value => {
  if( is.undefined( value ) )
    throw new Error( 'JsonTree requires a raw node, value, or valid JSON object' )

  if( isValue( value ) || Tree.isNode( value ) )
    return Tree( value )

  // need better handling for statics!
  return Tree({}).fromJson( value )
}

module.exports = JsonTree
