'use strict'

const is = require( '@mojule/is' )
const TreeFactory = require( '@mojule/tree' ).Factory
const FactoryFactory = require( '@mojule/tree' ).FactoryFactory
const defaultPlugins = require( './plugins' )
const Factory = FactoryFactory( TreeFactory, defaultPlugins )
const JsonTree = Factory()

Object.assign( JsonTree, { Factory } )

module.exports = JsonTree
