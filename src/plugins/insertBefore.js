'use strict'

const T = require( 'mtype' )

const t = T()
const defaultPropertyName = 'New property '

const insertBeforePlugin = fn => {
  const originalInsertBefore = fn.insertBefore

  const insertBefore = ( fn, root, parentNode, childNode, referenceNode ) => {
    const parentNodeType = fn.nodeType( fn, parentNode )

    if( parentNodeType === 'object' ){
      let value = fn.value( childNode )
      let { propertyName } = value
      let currentIndex = 0

      const setPropertyName = () => {
        propertyName = defaultPropertyName + currentIndex

        value.propertyName = propertyName
        fn.value( childNode, value )

        currentIndex++
      }

      if( !t.is( propertyName, 'string' ) || propertyName.length === 0 )
        setPropertyName()

      while( fn.hasProperty( fn, parentNode, propertyName ) )
        setPropertyName()
    }

    return originalInsertBefore( fn, root, parentNode, childNode, referenceNode )
  }

  insertBefore.def = originalInsertBefore.def

  insertBefore.def.requires.push( 'hasProperty' )

  return Object.assign( fn, { insertBefore } )
}

module.exports = insertBeforePlugin
