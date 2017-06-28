'use strict'

const is = require( '@mojule/is' )

const properties = ({ api }) => {
  if( api.nodeName !== 'object' ) return

  api.getProperty = propertyName =>
    api.childNodes.find( child => child.value.propertyName === propertyName )

  api.setProperty = ( propertyName, child ) => {
    if( !is.string( propertyName ) )
      throw Error(
        'setProperty expects a propertyName string as first argument'
      )

    child.assign({ propertyName })

    const existing = api.getProperty( propertyName )

    if( existing )
      return api.replaceChild( existing, child )

    return api.appendChild( child )
  }

  api.hasProperty = propertyName =>
    api.childNodes.some( child => child.value.propertyName === propertyName )

  api.removeProperty = propertyName => {
    const existing = api.getProperty( propertyName )

    if( !existing )
      throw Error(
        `Object node does not have a property "${ propertyName }"`
      )

    return existing.remove()
  }

  api.keys = () =>
    api.childNodes.toArray().map( child => child.value.propertyName )

  api.values = () => api.childNodes.toArray().map( child => child.toJson() )

  api.renameProperty = ( existingPropertyName, propertyName ) => {
    const existing = api.getProperty( existingPropertyName )

    if( !existing )
      throw Error(
        `Object node does not have a property "${ propertyName }"`
      )

    existing.assign({ propertyName })

    return existing
  }
}

module.exports = properties
