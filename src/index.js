'use strict'

const TreeFactory = require( '1tree-factory' )
const plugins = require( './plugins' )
const createTreePlugin = require( './plugins/createTree' )

const JsonTree = TreeFactory( ...plugins )

// added afterwards to ensure createTree plugin already exists, as it wraps it
JsonTree.plugin( createTreePlugin )

module.exports = JsonTree
