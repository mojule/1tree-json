# 1tree-json

Allows conversion between JSON objects and 1tree instances

```javascript
const JsonTree = require( '1tree-json' )

const jsonData = require( './test-data.json' )

const tree = JsonTree( jsonData )

const numbers = tree.findAll( node => node.isNumber() )

numbers.forEach( numberNode => {
  const value = node.value()

  value.nodeValue *= 2

  node.value( value )
})

const newData = tree.toJson()

console.log( JSON.stringify( newData, null, 2 ) )
```
