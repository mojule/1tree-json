'use strict'

const assert = require( 'assert' )

const testData = require( './fixtures/test.json' )

const { toTree, toJson } = require( '../src' )

describe( '1tree/json converter', () => {
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
