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
    it( 'Bad nodeType', () => {
      assert.throws( () =>
        Json( { nodeType: 0 } )
      )

      const objNode = Json( { a: 'a', b: 'b' } )

      objNode.value.nodeType = 0

      assert.throws( () => objNode.toJson() )
    })

    it( 'Bad properties', () => {
      const objNode = Json( { a: 'a', b: 'b' } )

      assert.throws( () => objNode.setProperty() )
      assert.throws( () => objNode.setProperty( 4 ) )
      assert.throws( () => objNode.removeProperty( 'c' ) )
      assert.throws( () => objNode.renameProperty( 'c', 'b' ) )
    })

    it( 'No value', () => {
      assert.throws( () => {
        const nope = Json()
      })
    })
  })

  describe( 'State handlers', () => {
    it( 'takes a raw node value', () => {
      const value = {
        nodeType: Json.STRING_NODE,
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

    describe( 'treeName', () => {
      it( 'is correct', () => {
        assert.strictEqual( Json( {} ).treeName, 'json-tree' )
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

      assert( a.isStringNode() )
      assert( !a.isObjectNode() )
      assert( !a.isNumberNode() )
      assert( !a.isBooleanNode() )
      assert( !a.isArrayNode() )
      assert( !a.isNullNode() )

      assert( !b.isStringNode() )
      assert( b.isObjectNode() )
      assert( !b.isNumberNode() )
      assert( !b.isBooleanNode() )
      assert( !b.isArrayNode() )
      assert( !b.isNullNode() )

      assert( !c.isStringNode() )
      assert( !c.isObjectNode() )
      assert( c.isNumberNode() )
      assert( !c.isBooleanNode() )
      assert( !c.isArrayNode() )
      assert( !c.isNullNode() )

      assert( !d.isStringNode() )
      assert( !d.isObjectNode() )
      assert( !d.isNumberNode() )
      assert( d.isBooleanNode() )
      assert( !d.isArrayNode() )
      assert( !d.isNullNode() )

      assert( !e.isStringNode() )
      assert( !e.isObjectNode() )
      assert( !e.isNumberNode() )
      assert( !e.isBooleanNode() )
      assert( e.isArrayNode() )
      assert( !e.isNullNode() )

      assert( !f.isStringNode() )
      assert( !f.isObjectNode() )
      assert( !f.isNumberNode() )
      assert( !f.isBooleanNode() )
      assert( !f.isArrayNode() )
      assert( f.isNullNode() )
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

  it( 'is empty', () => {
    const str = Json.createString( 'b', 'a' )
    const num = Json.createNumber( 1, 'b' )
    const bool = Json.createBoolean( true, 'c' )
    const nul = Json.createNull( 'd' )
    const arr = Json.createArray( 'e' )
    const obj = Json.createObject( 'f' )

    assert( str.isEmpty() )
    assert( num.isEmpty() )
    assert( bool.isEmpty() )
    assert( nul.isEmpty() )
    assert( !arr.isEmpty() )
    assert( !obj.isEmpty() )
  })

  describe( 'Static create methods', () => {
    it( 'creates a string', () => {
      const node = Json.createString( 'abc' )

      assert( node.isStringNode() )
      assert.strictEqual( node.nodeValue, 'abc' )
    })

    it( 'bad string', () => {
      assert.throws( () => Json.createString( 123 ) )
    })

    it( 'creates a number', () => {
      const node = Json.createNumber( 123 )

      assert( node.isNumberNode() )
      assert.strictEqual( node.nodeValue, 123 )
    })

    it( 'bad number', () => {
      assert.throws( () => Json.createNumber( 'abc' ) )
    })

    it( 'creates a boolean', () => {
      const node = Json.createBoolean( true )

      assert( node.isBooleanNode() )
      assert.strictEqual( node.nodeValue, true )
    })

    it( 'bad boolean', () => {
      assert.throws( () => Json.createBoolean( null ) )
    })

    it( 'creates an object', () => {
      const node = Json.createObject()

      assert( node.isObjectNode() )
      assert.deepEqual( node.toJson(), {} )
    })

    it( 'creates an array', () => {
      const node = Json.createArray()

      assert( node.isArrayNode() )
      assert.deepEqual( node.toJson(), [] )
    })

    it( 'creates property names', () => {
      const parent = Json.createObject()

      const str = Json.createString( 'b', 'a' )
      const num = Json.createNumber( 1, 'b' )
      const bool = Json.createBoolean( true, 'c' )
      const nul = Json.createNull( 'd' )
      const arr = Json.createArray( 'e' )
      const obj = Json.createObject( 'f' )

      parent.append( str, num, bool, nul, arr, obj )

      assert.deepEqual(
        parent.toJson(),
        {
          a: 'b',
          b: 1,
          c: true,
          d: null,
          e: [],
          f: {}
        }
      )
    })
  })
})
