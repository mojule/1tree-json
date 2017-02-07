'use strict'

const assert = require( 'assert' )

const testData = require( './fixtures/test.json' )

const { toTree, toJson } = require( '../src' )

describe( '1tree/json converter', () => {
  it( 'converts back and forth symmetrically', () => {
    testData.forEach( el => {
      const originalJsonStr = JSON.stringify( el )

      it( 'is symmetrical for ' + originalJsonStr, () => {
        const dataTree = toTree( el )
        const dataBackToJson = toJson( dataTree )

        const roundTrippedJsonStr = JSON.stringify( dataBackToJson )

        assert.equal( originalJsonStr, roundTrippedJsonStr )
      })
    })
  })

  it( 'adds property name', () => {
    const objNode = toTree({
      a: 1
    })

    const numNode = toTree( 2 )

    objNode.append( numNode )

    const obj = toJson( objNode )

    assert.deepEqual( obj, {
      a: 1,
      'New property 0': 2
    })
  })

  it( 'adds property name when already taken', () => {
    const objNode = toTree({
      a: 1
    })

    const numNode = toTree( 2 )

    const value = numNode.value()
    value.propertyName = 'a'
    numNode.value( value )

    objNode.append( numNode )

    const obj = toJson( objNode )

    assert.deepEqual( obj, {
      a: 1,
      'New property 0': 2
    })

    const numNode2 = toTree( 3 )

    objNode.append( numNode2 )

    const obj2 = toJson( objNode )

    assert.deepEqual( obj2, {
      a: 1,
      'New property 0': 2,
      'New property 1': 3
    })

    const numNode3 = toTree( 4 )
    const value3 = numNode3.value()
    value3.propertyName = 'a'
    numNode3.value( value3 )

    objNode.append( numNode3 )

    const obj3 = toJson( objNode )

    assert.deepEqual( obj3, {
      a: 1,
      'New property 0': 2,
      'New property 1': 3,
      'New property 2': 4
    })


    const numNode4 = toTree( 5 )
    const value4 = numNode4.value()
    value4.propertyName = 'New property 2'
    numNode4.value( value4 )

    objNode.append( numNode4 )

    const obj4 = toJson( objNode )

    assert.deepEqual( obj4, {
      a: 1,
      'New property 0': 2,
      'New property 1': 3,
      'New property 2': 4,
      'New property 3': 5
    })
  })
})
