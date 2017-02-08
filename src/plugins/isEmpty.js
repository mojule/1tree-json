'use strict'

const typenames = require( '../typenames' )

const { containerTypes } = typenames

const isEmptyPlugin = fn => {
  const isEmpty = ( fn, node ) => {
    const nodeType = fn.nodeType( fn, node )

    return !containerTypes.includes( nodeType )
  }

  isEmpty.def = fn.isEmpty.def

  return Object.assign( fn, { isEmpty } )
}

module.exports = isEmptyPlugin
