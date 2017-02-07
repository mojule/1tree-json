const T = require( 'mtype' )

const valueTypes = [ 'string', 'number', 'boolean' ]
const containerTypes = [ 'object', 'array' ]

const t = T()

const isEmptyPlugin = fn => {
  const isEmpty = ( fn, node ) => {
    const nodeType = fn.nodeType( fn, node )

    return !containerTypes.includes( nodeType )
  }

  isEmpty.def = fn.isEmpty.def

  return Object.assign( fn, { isEmpty } )
}

const defaultPropertyName = 'New property '

const hasPropertyName = ( fn, node, propertyName ) => {
  const children = fn.getChildren( node )

  const propertyNameAlreadyExists = children.some( siblingNode => {
    const siblingValue = fn.value( siblingNode )
    const siblingPropertyName = siblingValue.propertyName

    return siblingPropertyName === propertyName
  })

  return propertyNameAlreadyExists
}

const insertBeforePlugin = fn => {
  const originalInsertBefore = fn.insertBefore

  const insertBefore = ( fn, root, parentNode, childNode, referenceNode ) => {
    const parentNodeType = fn.nodeType( fn, parentNode )

    if( parentNodeType === 'object' ){
      let value = fn.value( childNode )
      let { propertyName } = value
      let currentIndex = 0

      const addPropertyName = () => {
        propertyName = defaultPropertyName + currentIndex

        value.propertyName = propertyName
        fn.value( childNode, value )

        currentIndex++
      }

      if( !t.is( propertyName, 'string' ) || propertyName.length === 0 )
        addPropertyName()

      while( hasPropertyName( fn, parentNode, propertyName ) )
        addPropertyName()
    }
    return originalInsertBefore( fn, root, parentNode, childNode, referenceNode )
  }

  insertBefore.def = originalInsertBefore.def

  return Object.assign( fn, { insertBefore } )
}

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

const plugins = [ isEmptyPlugin, insertBeforePlugin, slugPlugin ]

module.exports = plugins
