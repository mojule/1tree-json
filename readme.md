# json-tree

`tree` adapter over JSON-compatible objects

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
