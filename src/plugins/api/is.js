'use strict'

const utils = require( '@mojule/utils' )
const nodeNames = require( '../nodeNames' )

const { allTypes } = nodeNames
const { capitalizeFirstLetter } = utils

const is = ({ api }) => {
  allTypes.forEach( name => {
    const fname = 'is' + capitalizeFirstLetter( name )

    api[ fname ] = () => api.nodeName === name
  })
}

module.exports = is
