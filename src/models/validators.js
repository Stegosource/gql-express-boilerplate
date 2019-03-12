const Joi = require('joi')

exports.string = () => {
  return Joi.string()
    .trim()
    .max(255)
}

exports.text = () => {
  return Joi.string().trim()
}

exports.email = () => {
  return Joi.string()
    .trim()
    .max(255)
    .email()
    .allow('', null)
    .empty(null)
    .default('')
}

exports.uint = () => {
  return Joi.number().min(0)
}

exports.boolint = () => {
  return Joi.number().valid(0, 1, false, true)
}

exports.number = Joi.number

exports.object = Joi.object

exports.date = Joi.date

exports.validate = (input, schema) => {
  return Joi.attempt(input, schema, { abortEarly: false })
}
