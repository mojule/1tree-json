'use strict'

const is = require( '@mojule/is' )

const propertiesPlugin = ( node, state ) => {
  // being called in static context, or not an object node
  if( is.undefined( state ) || node.nodeType() !== 'object' )
    return {}

  const getProperty = propertyName => {
    const children = node.getChildren()

    return children.find( child =>
      child.getValue( 'propertyName' ) === propertyName
    )
  }

  // add child and set its propertyName, or replace existing property
  const setProperty = ( propertyName, child ) => {
    if( !is.string( propertyName ) )
      throw new Error(
        'setProperty expects a propertyName string as first argument'
      )

    const existing = node.getProperty( propertyName )

    if( existing )
      existing.remove()

    child.assign( { propertyName } )

    return node.add( child )
  }

  const hasProperty = propertyName => !!node.getProperty( propertyName )

  const removeProperty = propertyName => {
    const existing = node.getProperty( propertyName )

    if( !existing )
      throw new Error(
        `Object node does not have a property "${ propertyName }"`
      )

    return existing.remove()
  }

  const keys = () => {
    const children = node.getChildren()

    const keys = children.map( child => child.getValue( 'propertyName' ) )

    return keys
  }

  const values = () => {
    const children = node.getChildren()

    const values = children.map( child => child.getValue( 'nodeValue' ) )

    return values
  }

  const renameProperty = ( existingPropertyName, propertyName ) => {
    const existing = node.getProperty( existingPropertyName )

    if( !existing )
      throw new Error(
        `Object node does not have a property "${ propertyName }"`
      )

    existing.assign( { propertyName } )

    return existing
  }

  return {
    getProperty, setProperty, hasProperty, removeProperty, keys, values,
    renameProperty
  }
}

module.exports = propertiesPlugin
