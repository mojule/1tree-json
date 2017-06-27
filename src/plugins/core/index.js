'use strict'

const is = require( '@mojule/is' )
const nodeTypes = require( '../nodeTypes' )

const { allTypes } = nodeTypes

const isValue = value =>
  is.object( value ) && is.string( value.nodeType )

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
    allTypes.includes( state.value.nodeType )
}

module.exports = core
