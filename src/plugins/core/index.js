'use strict'

const is = require( '@mojule/is' )
const nodeNames = require( '../nodeNames' )

const { allTypes } = nodeNames

const isValue = value =>
  is.object( value ) && is.string( value.nodeName )

const core = ({ core, Api }) => {
  const { createState, getState } = core

  core.createState = value => {
    if( isValue( value ) )
      return createState( value )

    const api = Api.fromJson( value )

    return getState( api )
  }

  core.isState = state =>
    is.object( state ) && isValue( state.value ) &&
    allTypes.includes( state.value.nodeName )
}

module.exports = core
