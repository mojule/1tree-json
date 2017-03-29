'use strict'

const utils = require( '@mojule/utils' )
const typenames = require( '../typenames' )

const { allTypes } = typenames
const { capitalizeFirstLetter } = utils

const typesPlugin = node => {
  return allTypes.reduce( ( types, typename ) => {
    const fname = 'is' + capitalizeFirstLetter( typename )

    types[ fname ] = () => node.nodeType() === typename

    return types
  }, {} )
}

module.exports = typesPlugin
