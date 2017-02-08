'use strict'

//replace with fn.isObject, isString etc.
const isObjectNode = ( fn, node ) => {
  const nodeType = fn.nodeType( fn, node )

  return nodeType === 'object'
}

const enforceObject = ( fn, node, fname ) => {
  if( !isObjectNode( fn, node ) )
    throw new Error( `${ fname } can only be called on an object node` )
}

const propertiesPlugin = fn => {
  const getProperty = ( fn, node, propertyName ) => {
    enforceObject( fn, node, 'getProperty' )

    const children = fn.getChildren( node )

    const property = children.find( siblingNode => {
      const siblingValue = fn.value( siblingNode )
      const siblingPropertyName = siblingValue.propertyName

      return siblingPropertyName === propertyName
    })

    return property
  }

  getProperty.def = {
    argTypes: [ 'fn', 'node', 'string' ],
    returnType: 'node',
    requires: [ 'getChildren', 'value' ],
    categories: [ 'meta', 'plugin' ]
  }

  const setProperty = ( fn, root, parentNode, childNode, propertyName ) => {
    enforceObject( fn, parentNode, 'setProperty' )

    const existing = fn.getProperty( fn, parentNode, propertyName )

    const childNodeValue = fn.value( childNode )
    childNodeValue.propertyName = propertyName
    fn.value( childNode, childNodeValue )

    if( existing ){
      fn.insertBefore( fn, root, parentNode, childNode, existing )
      fn.remove( fn, root, existing )

      return childNode
    }

    return fn.append( fn, root, parentNode, childNode )
  }

  setProperty.def = {
    argTypes: [ 'fn', 'rootNode', 'node', 'node', 'string' ],
    returnType: 'node',
    requires: [ 'getProperty', 'value', 'insertBefore', 'append' ],
    categories: [ 'meta', 'plugin' ]
  }

  const hasProperty = ( fn, node, propertyName ) => {
    enforceObject( fn, node, 'hasProperty' )

    const property = fn.getProperty( fn, node, propertyName )

    return !!property
  }

  hasProperty.def = {
    argTypes: [ 'fn', 'node', 'string' ],
    returnType: 'boolean',
    requires: [ 'getProperty' ],
    categories: [ 'meta', 'plugin' ]
  }

  const removeProperty = ( fn, root, node, propertyName ) => {
    enforceObject( fn, node, 'removeProperty' )

    const property = fn.getProperty( fn, node, propertyName )

    if( !property )
      throw new Error(
        `Object node does not have a property "${ propertyName }"`
      )

    return fn.remove( fn, root, property )
  }

  removeProperty.def = {
    argTypes: [ 'fn', 'rootNode', 'node', 'string' ],
    returnType: 'node',
    requires: [ 'getProperty', 'remove' ],
    categories: [ 'meta', 'plugin' ]
  }

  const keys = ( fn, node ) => {
    enforceObject( fn, node, 'keys' )

    const children = fn.getChildren( node )

    const keys = children.map( childNode => {
      const value = fn.value( childNode )

      return value.propertyName
    })

    return keys
  }

  keys.def = {
    argTypes: [ 'fn', 'node' ],
    returnType: '[string]',
    requires: [ 'getChildren', 'value' ],
    categories: [ 'meta', 'plugin' ]
  }

  const values = ( fn, node ) => {
    enforceObject( fn, node, 'values' )

    const children = fn.getChildren( node )

    const values = children.map( childNode => {
      const value = fn.value( childNode )

      return value.nodeValue
    })

    return values
  }

  values.def = {
    argTypes: [ 'fn', 'node' ],
    returnType: '[any]',
    requires: [ 'getChildren', 'value' ],
    categories: [ 'meta', 'plugin' ]
  }

  const renameProperty = ( fn, node, propertyName, newPropertyName ) => {
    enforceObject( fn, node, 'renameProperty' )

    const property = fn.getProperty( fn, node, propertyName )

    if( !property )
      throw new Error(
        `Object node does not have a property "${ propertyName }"`
      )

    const propertyValue = fn.value( property )
    propertyValue.propertyName = newPropertyName
    fn.value( property, propertyValue )

    return property
  }

  renameProperty.def = {
    argTypes: [ 'fn', 'node', 'string', 'string' ],
    returnType: 'node',
    requires: [ 'getProperty', 'value' ],
    categories: [ 'meta', 'plugin' ]
  }

  return Object.assign( fn, {
    getProperty, setProperty, hasProperty, removeProperty, keys, values,
    renameProperty
  })
}

module.exports = propertiesPlugin
