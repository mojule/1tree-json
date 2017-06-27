'use strict'

const nodeValue = ({ api }) => {
  Object.defineProperty( api, 'nodeValue', {
    get: () => api.value.nodeValue
  })
}

module.exports = nodeValue
