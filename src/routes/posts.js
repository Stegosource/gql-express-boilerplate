const router = require('express').Router()
const asyncWrap = require('../middleware/asyncWrap')
const { getPosts, getPostById } = require('../models/posts')
const { formatPost } = require('./formatters')

router.get(
  '/',
  asyncWrap(async (req, res) => {
    const { offset, count, author } = req.args

    const posts = await getPosts({ offset, count, author })

    res.success({ posts: posts.map(formatPost) })
  })
)

router.get(
  '/:postId',
  asyncWrap(async (req, res) => {
    const { postId } = req.params

    const post = await getPostById(postId)

    res.success({
      post: formatPost(post)
    })
  })
)

module.exports = router
