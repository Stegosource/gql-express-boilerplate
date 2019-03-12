const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const isDev = process.env.NODE_ENV !== 'production'

// response helpers
express.response.success = function(data) {
  return this.json({
    success: true,
    data
  })
}

express.response.error = function(error, statusCode) {
  // The Error contstructor is treated differently than a normal object
  const clientError = {
    ...error,
    message: error.message,
    name: error.name
  }
  if (isDev) clientError.stack = error.stack

  return this.status(statusCode || error.statusCode || 500).json({
    success: false,
    error: clientError
  })
}

// Middlewares
app.use(require('helmet')()) // security headers
app.use(require('compression')()) // compression
app.use(require('morgan')('dev')) // logging
app.use(require('cors')()) // CORS
app.use(require('cookie-parser')(process.env.COOKIES_SECRET || 'Yum!')) // 🍪
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use((req, res, next) => {
  req.args = {}
  Array('params', 'query', 'body').forEach(reqKey => {
    if (typeof req[reqKey] === 'object') {
      Object.assign(req.args, req[reqKey])
    }
  })
  next()
})

// Routes
app.use('/', require(`./router`))

// 404 error handling
app.use((req, res, next) => {
  res.error(new Error('Not found'), 404)
})

// error handling
app.use((error, req, res, next) => {
  console.error(`!!! Handled Error: ${req.originalUrl} - ${error.message || error.response} !!!`)
  if (error.stack) console.error(`    ${error.stack}`)

  res.error(error)
})

module.exports = app
