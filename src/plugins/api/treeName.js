'use strict'

const api = ({ api, privates }) => {
  privates.registerGet({
    target: api,
    name: 'treeName',
    get: () => 'json-tree'
  })
}

module.exports = api
