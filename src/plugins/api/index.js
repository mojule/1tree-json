'use strict'

const properties = require( './object/properties' )

const nodeValue = require( './query/nodeValue' )
const slug = require( './query/slug' )
const treeName = require( './query/treeName' )

const toJson = require( './toJson' )

module.exports = [ properties, nodeValue, slug, treeName, toJson ]
