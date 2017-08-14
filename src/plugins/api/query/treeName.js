'use strict'

const api = ({ api, core }) => {
  core.registerProperty({
    target: api,
    name: 'treeName',
    get: () => 'json-tree'
  })
}

module.exports = api
