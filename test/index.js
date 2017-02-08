'use strict'

const assert = require( 'assert' )
const testData = require( './fixtures/test.json' )
const Tree = require( '../src' )

describe( '1tree/json converter', () => {
  describe( 'converts back and forth symmetrically', () => {
    testData.forEach( el => {
      const originalJsonStr = JSON.stringify( el )

      it( 'is symmetrical for ' + originalJsonStr, () => {
        const dataTree = Tree( el )
        const dataBackToJson = dataTree.toJson()
        const roundTrippedJsonStr = JSON.stringify( dataBackToJson )

        assert.equal( originalJsonStr, roundTrippedJsonStr )
      })
    })
  })

  describe( 'plugins', () => {
    describe( 'properties', () => {
      it( 'getProperty', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Tree( obj )
        const propertyNode = node.getProperty( 'a' )
        const propertyNodeValue = propertyNode.value()

        assert( propertyNode )
        assert.equal( propertyNodeValue.propertyName, 'a' )
      })

      it( 'setProperty', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Tree( obj )
        const newPropertyNode = Tree( 3 )

        node.setProperty( newPropertyNode, 'c' )

        const propertyNode = node.getProperty( 'c' )
        const propertyNodeValue = propertyNode.value()

        assert( propertyNode )
        assert.equal( propertyNodeValue.propertyName, 'c' )
        assert.equal( propertyNodeValue.nodeValue, 3 )
      })

      it( 'hasProperty', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Tree( obj )

        assert( node.hasProperty( 'a' ) )
        assert( !node.hasProperty( 'c' ) )
      })

      it( 'removeProperty', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Tree( obj )

        node.removeProperty( 'a' )

        assert( node.hasProperty( 'b' ) )
        assert( !node.hasProperty( 'a' ) )
      })

      it( 'renameProperty', () => {
         const obj = {
          a: 1,
          b: 2
        }

        const node = Tree( obj )

        node.renameProperty( 'b', 'c' )

        assert( node.hasProperty( 'c' ) )
        assert( !node.hasProperty( 'b' ) )
      })

      it( 'keys', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Tree( obj )
        const keys = node.keys()

        assert.deepEqual( keys, [ 'a', 'b' ] )
      })

      it( 'values', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Tree( obj )
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

        const node = Tree( obj )
        const property = node.getProperty( 'a' )
        const slug = property.slug()

        assert.equal( slug, 'a' )
      })

      it( 'array slug', () => {
        const obj = [ 'a', 'b', 'c' ]

        const node = Tree( obj )
        const el = node.firstChild()
        const slug = el.slug()

        assert.equal( slug, '0' )
      })

      it( 'propertyName path', () => {
        const obj = {
          a: 1,
          b: 2
        }

        const node = Tree( obj )
        const property = node.getProperty( 'a' )
        const path = property.getPath()

        assert.equal( path, '/a' )
      })

      it( 'array path', () => {
        const obj = [ 'a', 'b', 'c' ]

        const node = Tree( obj )
        const el = node.firstChild()
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

      const node = Tree( obj )
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

  describe( 'handles property names', () => {
    it( 'adds property name', () => {
      const objNode = Tree({
        a: 1
      })

      const numNode = Tree( 2 )

      objNode.append( numNode )

      const obj = objNode.toJson()

      assert.deepEqual( obj, {
        a: 1,
        'New property 0': 2
      })
    })

    it( 'adds property name when already taken', () => {
      const objNode = Tree( {
        a: 1
      })

      const numNode = Tree( 2 )

      const value = numNode.value()
      value.propertyName = 'a'
      numNode.value( value )

      objNode.append( numNode )

      const obj = objNode.toJson()

      assert.deepEqual( obj, {
        a: 1,
        'New property 0': 2
      })

      const numNode2 = Tree( 3 )

      objNode.append( numNode2 )

      const obj2 = objNode.toJson()

      assert.deepEqual( obj2, {
        a: 1,
        'New property 0': 2,
        'New property 1': 3
      })

      const numNode3 = Tree( 4 )
      const value3 = numNode3.value()
      value3.propertyName = 'a'
      numNode3.value( value3 )

      objNode.append( numNode3 )

      const obj3 = objNode.toJson()

      assert.deepEqual( obj3, {
        a: 1,
        'New property 0': 2,
        'New property 1': 3,
        'New property 2': 4
      })

      const numNode4 = Tree( 5 )
      const value4 = numNode4.value()
      value4.propertyName = 'New property 2'
      numNode4.value( value4 )

      objNode.append( numNode4 )

      const obj4 = objNode.toJson()

      assert.deepEqual( obj4, {
        a: 1,
        'New property 0': 2,
        'New property 1': 3,
        'New property 2': 4,
        'New property 3': 5
      })
    })
  })
})
