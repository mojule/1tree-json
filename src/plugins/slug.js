'use strict'

const slugPlugin = fn => {
  const originalSlug = fn.slug

  const slug = ( fn, root, node ) => {
    if( root === node ) return ''

    const parent = fn.getParent( fn, root, node )
    const parentValue = fn.value( parent )
    const { nodeType } = parentValue

    if( nodeType === 'object' ){
      const value = fn.value( node )
      const { propertyName } = value

      return propertyName
    }

    return String( fn.index( fn, root, node ) )
  }

  slug.def = originalSlug.def

  return Object.assign( fn, { slug } )
}

module.exports = slugPlugin
