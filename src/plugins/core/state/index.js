'use strict'

const is = require( '@mojule/is' )

const isValue = value =>
  is.object( value ) && is.integer( value.nodeType )

const state = ({ core, Api }) => {
  const { createState, getState } = core

  core.createState = value => {
    if( isValue( value ) )
      return createState( value )

    const api = Api.fromJson( value )

    return getState( api )
  }

  core.isState = state =>
    is.object( state ) && isValue( state.value ) &&
    state.value.nodeType >= 20 && state.value.nodeType <= 25
}

module.exports = state
