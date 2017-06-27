'use strict'

const nodeTypes = require( '../nodeTypes' )

const { emptyTypes, containerTypes } = nodeTypes

const nodeType = ({ privates }) => {
  emptyTypes.forEach( name =>
    privates.registerNodeType({ name, isEmpty: true })
  )

  containerTypes.forEach( name =>
    privates.registerNodeType({ name, isEmpty: false })
  )
}

module.exports = nodeType
