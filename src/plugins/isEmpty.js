'use strict'

const typenames = require( '../typenames' )

const { containerTypes } = typenames

const isEmptyPlugin = node => {
  const isEmpty = () => {
    const nodeType = node.nodeType()

    return !containerTypes.includes( nodeType )
  }

  return { isEmpty }
}

module.exports = isEmptyPlugin
