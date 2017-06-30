'use strict'

const is = require( '@mojule/is' )

const nodeType = ({ core }) => {
  const createValueNode = typeName =>
    ( nodeValue, propertyName ) => {
      if( !is[ typeName ]( nodeValue ) )
        throw Error( `Expected nodeValue to be of type ${ typeName }` )

      return { nodeValue, propertyName }
    }

  core.registerNodeType({
    nodeType: 20,
    name: 'string',
    isEmpty: () => true,
    create: createValueNode( 'string' )
  })

  core.registerNodeType({
    nodeType: 21,
    name: 'number',
    isEmpty: () => true,
    create: createValueNode( 'number' )
  })

  core.registerNodeType({
    nodeType: 22,
    name: 'boolean',
    isEmpty: () => true,
    create: createValueNode( 'boolean' )
  })

  core.registerNodeType({
    nodeType: 23,
    name: 'null',
    isEmpty: () => true,
    create: propertyName => ({ propertyName })
  })

  core.registerNodeType({
    nodeType: 24,
    name: 'object',
    create: propertyName => ({ propertyName })
  })

  core.registerNodeType({
    nodeType: 25,
    name: 'array',
    create: propertyName => ({ propertyName })
  })
}

module.exports = nodeType
