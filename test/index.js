'use strict'

const assert = require( 'assert' )
const is = require( '@mojule/is' )
const testData = require( './fixtures/test.json' )
const Json = require( '../src' )

describe( 'tree/json converter', () => {
  describe( 'converts back and forth symmetrically', () => {
    testData.forEach( el => {
      const originalJsonStr = JSON.stringify( el )

      it( 'is symmetrical for ' + originalJsonStr, () => {
        const dataTree = Json( el )
        const dataBackToJson = dataTree.toJson()
        const roundTrippedJsonStr = JSON.stringify( dataBackToJson )

        assert.equal( originalJsonStr, roundTrippedJsonStr )
      })
    })
  })

  describe( 'Bad data', () => {
    it( 'Bad nodeName', () => {
      assert.throws( () =>
        Json( { nodeName: 'nope' } )
      )
    })

    it( 'Bad properties', () => {
      const objNode = Json( { a: 'a', b: 'b' } )

      assert.throws( () => objNode.setProperty() )
      assert.throws( () => objNode.setProperty( 4 ) )
      assert.throws( () => objNode.removeProperty( 'c' ) )
      assert.throws( () => objNode.renameProperty( 'c', 'b' ) )
    })

    it( 'No value', () => {
      assert.throws( () => Json() )
    })
  })

  describe( 'State handlers', () => {
    it( 'takes a raw node value', () => {
      const value = {
        nodeName: 'string',
        nodeValue: 'Hello'
      }

      const tree = Json( value )

      assert.equal( tree.toJson(), 'Hello' )
    })
  })

  describe( 'plugins', () => {
    describe( 'properties', () => {
      it( 'getProperty', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )
        const propertyNode = node.getProperty( 'a' )
        const { propertyName } = propertyNode.value

        assert( propertyNode )
        assert.equal( propertyName, 'a' )
      })

      it( 'setProperty', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )
        const newPropertyNode = Json( 3 )

        node.setProperty( 'c', newPropertyNode )

        const propertyNode = node.getProperty( 'c' )
        const { propertyName } = propertyNode.value

        assert( propertyNode )
        assert.equal( propertyName, 'c' )
        assert.equal( propertyNode.nodeValue, 3 )
      })

      it( 'setProperty replaces', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )
        const newPropertyNode = Json( 3 )

        node.setProperty( 'b', newPropertyNode )

        const propertyNode = node.getProperty( 'b' )
        const { propertyName } = propertyNode.value

        assert( propertyNode )
        assert.equal( propertyName, 'b' )
        assert.equal( propertyNode.nodeValue, 3 )
      })

      it( 'hasProperty', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )

        assert( node.hasProperty( 'a' ) )
        assert( !node.hasProperty( 'c' ) )
      })

      it( 'removeProperty', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )

        node.removeProperty( 'a' )

        assert( node.hasProperty( 'b' ) )
        assert( !node.hasProperty( 'a' ) )
      })

      it( 'renameProperty', () => {
         const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )

        node.renameProperty( 'b', 'c' )

        assert( node.hasProperty( 'c' ) )
        assert( !node.hasProperty( 'b' ) )
      })

      it( 'keys', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )
        const keys = node.keys()

        assert.deepEqual( keys, [ 'a', 'b' ] )
      })

      it( 'values', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )
        const values = node.values()

        assert.deepEqual( values, [ 1, 2 ] )
      })
    })

    describe( 'slug', () => {
      it( 'propertyName slug', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )
        const property = node.getProperty( 'a' )
        const slug = property.slug()

        assert.equal( slug, 'a' )
      })

      it( 'array slug', () => {
        const obj = [ 'a', 'b', 'c' ]

        const node = Json( obj )
        const slug = node.firstChild.slug()

        assert.equal( slug, '0' )
      })

      it( 'propertyName path', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Json( obj )
        const property = node.getProperty( 'a' )
        const path = property.getPath()

        assert.equal( path, '/a' )
      })

      it( 'array path', () => {
        const obj = [ 'a', 'b', 'c' ]

        const node = Json( obj )
        const el = node.firstChild
        const path = el.getPath()

        assert.equal( path, '/0' )
      })
    })
  })

  describe( 'types', () => {
    it( 'is type', () => {
      //string, object, number, boolean, array, null
      const obj = {
        a: 'x',
        b: {},
        c: 1,
        d: true,
        e: [],
        f: null
      }

      const node = Json( obj )
      const a = node.getProperty( 'a' )
      const b = node.getProperty( 'b' )
      const c = node.getProperty( 'c' )
      const d = node.getProperty( 'd' )
      const e = node.getProperty( 'e' )
      const f = node.getProperty( 'f' )

      assert( a.isString() )
      assert( !a.isObject() )
      assert( !a.isNumber() )
      assert( !a.isBoolean() )
      assert( !a.isArray() )
      assert( !a.isNull() )

      assert( !b.isString() )
      assert( b.isObject() )
      assert( !b.isNumber() )
      assert( !b.isBoolean() )
      assert( !b.isArray() )
      assert( !b.isNull() )

      assert( !c.isString() )
      assert( !c.isObject() )
      assert( c.isNumber() )
      assert( !c.isBoolean() )
      assert( !c.isArray() )
      assert( !c.isNull() )

      assert( !d.isString() )
      assert( !d.isObject() )
      assert( !d.isNumber() )
      assert( d.isBoolean() )
      assert( !d.isArray() )
      assert( !d.isNull() )

      assert( !e.isString() )
      assert( !e.isObject() )
      assert( !e.isNumber() )
      assert( !e.isBoolean() )
      assert( e.isArray() )
      assert( !e.isNull() )

      assert( !f.isString() )
      assert( !f.isObject() )
      assert( !f.isNumber() )
      assert( !f.isBoolean() )
      assert( !f.isArray() )
      assert( f.isNull() )
    })
  })

  describe( 'handles missing property names', () => {
    it( 'adds property name', () => {
      const objNode = Json({
        a: 1
      })

      objNode.appendChild( Json( 2 ) )
      objNode.appendChild( Json( 3 ) )

      const obj = objNode.toJson()

      assert.deepEqual( obj, {
        a: 1,
        'New property 0': 2,
        'New property 1': 3
      })
    })
  })
})
