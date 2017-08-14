'use strict'

const is = require( '@mojule/is' )
const Json = require( '../' )

const node = Json( { a: 1 } )

const pad = ( str, length = 30 ) => {
  while( str.length < length )
    str += ' '

  return str
}

const logKeys = obj => {
  Object.keys( obj ).forEach( key => {
    console.log( pad( key ), is.of( obj[ key ] ) )
  })
}

console.log( 'JSON Tree API (statics)' )
console.log( '---' )
logKeys( Json )

console.log()

console.log( 'node API (instance)' )
console.log( '---' )
logKeys( node )

