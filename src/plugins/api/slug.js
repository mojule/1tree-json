'use strict'

const is = require( '@mojule/is' )

const slug = ({ api, state }) => {
  const { slug } = api

  api.slug = () => {
    if( is.undefined( state.parentNode ) ) return slug()

    if( api.parentNode.nodeName === 'object' )
      return state.value.propertyName

    return slug()
  }
}

module.exports = slug
