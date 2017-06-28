'use strict'

const nodeNames = require( '../nodeNames' )

const { emptyTypes, containerTypes } = nodeNames

const nodeName = ({ privates }) => {
  emptyTypes.forEach( name =>
    privates.registerNodeName({ name, isEmpty: true })
  )

  containerTypes.forEach( name =>
    privates.registerNodeName({ name, isEmpty: false })
  )
}

module.exports = nodeName
