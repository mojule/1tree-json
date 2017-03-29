# json-tree

Use [tree](https://github.com/mojule/tree) API over JSON-compatible objects

## Install

`npm install @mojule/json-tree`

## Example

```javascript
const JsonTree = require( '@mojule/json-tree' )

const jsonData = require( './test-data.json' )

const tree = JsonTree( jsonData )

const numbers = tree.findAll( node => node.isNumber() )

numbers.forEach( numberNode => {
  const value = node.getValue( 'nodeValue' )

  value *= 2

  node.setValue( 'nodeValue', value )
})

const newData = tree.toJson()

console.log( JSON.stringify( newData, null, 2 ) )
```

## API

Inherits the same API as [tree](https://github.com/mojule/tree) and
[tree-factory](https://github.com/mojule/tree-factory), and adds the following
plugins:

### toJson

Converts a node back to it's JSON compatible object representation

```javascript
const objNode = JsonTree( { foo: 'bar' } )

const obj = objNode.toJson()

// { foo: 'bar' }
console.log( obj )
```

### isEmpty

Overrides the default implementation (which always returns `false`) and returns
`true` if the node represents `null`, `string`, `number` or `boolean`.

This ensures that trying to add children to any of these nodes will throw an
error - see the tree-factory documentation for more details.

```javascript
const arrayNode = JsonTree( [ 36 ] )
const numNode = JsonTree( 42 )

// OK
arrayNode.add( numNode )

// throws
numNode.add( arrayNode )
```

### slug

Overrides the default implementation so that if a node is a property node,
the propertyName is returned instead of the node's index within its parent.
This also affects `getPath` and `atPath`, as paths are generated from slugs

```javascript
const objNode = JsonTree( { foo: 'bar' } )
const fooNode = objNode.getProperty( 'foo' )

// 'foo'
console.log( fooNode.slug() )

// '/foo'
console.log( fooNode.getPath() )
```

### Property plugins

Only added to object nodes.

#### getProperty

Returns the node representing a named property on an object node. Returns
`undefined` if the object does not have the property.

```javascript
const objNode = JsonTree( { foo: 'bar' } )
const fooNode = objNode.getProperty( 'foo' )

// 'bar'
console.log( fooNode.getValue( 'nodeValue' ) )
```

#### setProperty

Sets the named property on the object, replacing it if it already exists

```javascript
const objNode = JsonTree( { foo: 'bar' } )

objNode.setProperty( 'foo', JsonTree( 'new bar' ) )

const fooNode = objNode.getProperty( 'foo' )

// 'new bar'
console.log( fooPropertyNode.getValue( 'nodeValue' ) )
```

#### hasProperty

Returns `true` if the object has the named property, `false` if not.

```javascript
const objNode = JsonTree( { foo: 'bar' } )

// true
console.log( objNode.hasProperty( 'foo' ) )

// false
console.log( objNode.hasProperty( 'nope' ) )
```

#### removeProperty

Removes the named property node from the object node. Will throw if the named
property does not exist.

```javascript
const objNode = JsonTree( { foo: 'bar' } )

// true
console.log( objNode.hasProperty( 'foo' ) )

objNode.removeProperty( 'foo' )

// false
console.log( objNode.hasProperty( 'foo' ) )
```

#### renameProperty

Renames the named property. Will throw if the named property does not exist.

```javascript
const objNode = JsonTree( { foo: 'bar' } )

// true
console.log( objNode.hasProperty( 'foo' ) )

objNode.renameProperty( 'foo', 'newFoo' )

// false
console.log( objNode.hasProperty( 'foo' ) )

// true
console.log( objNode.hasProperty( 'newFoo' ) )
```

#### keys

Returns a list of all the object node's property names

```javascript
const objNode = JsonTree( { foo: 'bar', abc: 'xyz' } )

// [ 'foo', 'abc' ]
console.log( objNode.keys() )
```

#### keys

Returns a list of all the object node's property values

```javascript
const objNode = JsonTree( { foo: 'bar', abc: 'xyz' } )

// [ 'bar', 'xyz' ]
console.log( objNode.values() )
```

### Type plugins

`isObject`, `isArray`, `isString`, `isNumber`, `isBoolean`, `isNull`

```javascript
const objNode = JsonTree( { foo: 'bar' } )

// true
console.log( objNode.isObject() )

// false
console.log( objNode.isArray() )
```