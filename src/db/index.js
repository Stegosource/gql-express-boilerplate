const env = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[env]
const db = require('knex')(config)

exports.db = db

exports.TABLES = {
  USER: 'user',
  POST: 'post'
}
