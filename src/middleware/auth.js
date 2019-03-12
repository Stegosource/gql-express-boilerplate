const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const { getUserById } = require('../models/users')

const jwtSecret = process.env.JWT_SECRET || 'jwtsecret'
const jwtVerify = promisify(jwt.verify)

module.exports = async (req, res, next) => {
  if (!req.user) {
    const error = new Error('You are not allowed to do that.')
    error.statusCode = 401
    return res.error(error)
  }
  next()
}

module.exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) throw 'nah'

    // Verify token from Auth headers
    const authToken = authHeader.split(' ')[1]
    const { id } = await jwtVerify(authToken, jwtSecret)

    // Get the user by ID
    const user = await getUserById(id)
    if (!user) throw 'nah'

    // Add the user to the request object and continue
    req.user = user
  } catch (error) {
  } finally {
    next()
  }
}
