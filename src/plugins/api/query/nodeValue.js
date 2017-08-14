'use strict'

const nodeValue = ({ api, Api }) => {
  const valueTypes = [ Api.STRING_NODE, Api.NUMBER_NODE, Api.BOOLEAN_NODE ]

  api.isValueNode = () => valueTypes.includes( api.nodeType )

  if( !api.isValueNode() ) return

  Object.defineProperty( api, 'nodeValue', {
    get: () => api.value.nodeValue
  })
}

module.exports = nodeValue
