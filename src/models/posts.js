const { db, TABLES } = require('../db')
const validators = require('./validators')

exports.getPosts = ({ offset, count, author }) => {
  let query = db(TABLES.POST)
    .whereNot({ title: '' })
    .orderBy('created_at')
    .offset(offset || 0)
    .limit(count || 24)

  if (author) {
    query = query.andWhere({ author })
  }

  return query
}

exports.getPostById = postId => {
  const id = validators.validate(postId, validators.uint().required())
  return db(TABLES.POST)
    .where({ id })
    .first()
}

exports.createPost = async params => {
  const post = validators.validate(params, {
    title: validators.string().required()
  })
  await db(TABLES.POST).insert(post)
  return post
}
