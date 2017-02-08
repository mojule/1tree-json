'use strict'

const utils = require( 'mojule-utils' )
const typenames = require( '../typenames' )

const { allTypes } = typenames
const { capitalizeFirstLetter } = utils

const typesPlugin = fn => {
  allTypes.forEach( typename => {
    const fname = 'is' + capitalizeFirstLetter( typename )

    fn[ fname ] = ( fn, node ) => {
      const nodeType = fn.nodeType( fn, node )

      return nodeType === typename
    }

    fn[ fname ].def = {
      argTypes: [ 'fn', 'node' ],
      returnType: 'boolean',
      requires: [ 'nodeType' ],
      categories: [ 'meta', 'plugin' ]
    }
  })

  return fn
}

module.exports = typesPlugin
