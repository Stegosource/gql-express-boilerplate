const { promisify } = require('util')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const asyncWrap = require('../middleware/asyncWrap')
const auth = require('../middleware/auth')
const { editUser } = require('../models/users')
const validators = require('../models/validators')
const { formatUser } = require('./formatters')

const jwtSecret = process.env.JWT_SECRET || 'jwtsecret'
const jwtVerify = promisify(jwt.verify)

router.post('/register', (req, res) => {
  // TODO

  // Generate auth token
  const token = jwt.sign({ secret }, jwtSecret, {
    expiresIn: 30 // seconds
  })

  res.success({ token })
})

router.post(
  '/login',
  auth,
  asyncWrap(async (req, res) => {
    // Validate request
    const { username, password } = validators.validate(req.args, {
      username: validators.username().required(),
      password: validators.password().required()
    })

    // TODO

    // const token = jwt.sign({ id: user.id }, jwtSecret, {
    //   expiresIn: 24 * 60 * 60 // 24 hours in seconds
    // })

    res.success({
      user: formatUser(user),
      token
    })
  })
)

router.get('/me', auth, (req, res) => {
  res.success({
    user: formatUser(req.user)
  })
})

router.patch(
  '/:userId',
  auth,
  asyncWrap(async (req, res) => {
    const { id } = req.user
    const { userId, edits } = req.args

    if (userId !== id) throw new Error('You are not allowed to do that.')

    const user = await editUser({ id, edits })

    res.success({
      user: formatUser(user)
    })
  })
)

module.exports = router
