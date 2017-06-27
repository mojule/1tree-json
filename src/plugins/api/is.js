'use strict'

const utils = require( '@mojule/utils' )
const nodeTypes = require( '../nodeTypes' )

const { allTypes } = nodeTypes
const { capitalizeFirstLetter } = utils

const is = ({ api }) => {
  allTypes.forEach( name => {
    const fname = 'is' + capitalizeFirstLetter( name )

    api[ fname ] = () => api.nodeType === name
  })
}

module.exports = is
