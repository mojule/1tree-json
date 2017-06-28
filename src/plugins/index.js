'use strict'

const core = require( './core' )

const fromJson = require( './statics/fromJson' )

const properties = require( './api/object/properties' )
const is = require( './api/is' )
const nodeValue = require( './api/nodeValue' )
const slug = require( './api/slug' )
const toJson = require( './api/toJson' )

const nodeName = require( './privates/nodeName' )

module.exports = {
  core,
  statics: [ fromJson ],
  api: [ properties, is, nodeValue, slug, toJson ],
  privates: [ nodeName ]
}
