exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', table => {
      table.increments('id')
      table.string('email')
      table.string('password')
      table.timestamps(true, true)
    }),

    knex.schema.createTable('post', table => {
      table.increments('id')
      table.string('title')
      table.timestamps(true, true)
    })
  ]).then(() => {
    // Anything that needs to be setup...
  })
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTableIfExists('user'), knex.schema.dropTableIfExists('post')])
}
