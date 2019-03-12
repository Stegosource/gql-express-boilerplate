const Query = {
  hello: (_, { name }) => `Hello ${name || 'World'}`
}

module.exports = Query
