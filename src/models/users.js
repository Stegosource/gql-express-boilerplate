const { db, TABLES } = require('../db')
const validators = require('./validators')

const defaultSelect = {
  id: 'id',
  email: 'email'
}
function selectUser(select = defaultSelect) {
  return db(TABLES.USER).select(select)
}

exports.createUser = async params => {
  const { email } = validators.validate(params, {
    email: validators.email().required()
  })

  const id = await db(TABLES.USER).insert({ email })
  const newUser = await selectUser()
    .where({ id })
    .first()
  return newUser
}

exports.getUserById = async userId => {
  const id = validators.validate(userId, validators.uint())
  const users = await selectUser()
    .where({ id })
    .first()
  return users || null
}

exports.editUser = async params => {
  // Start of with an empty edits object
  const input = {
    id: params.id,
    edits: {}
  }

  // Only allow specific fields to be added to the edit object, and convert camelCase to snake_case
  const allowedFields = {
    email: 'email'
  }
  Object.keys(allowedFields).forEach(fieldName => {
    if (!params.edits.hasOwnProperty(fieldName)) return

    const dbColumn = allowedFields[fieldName]
    const value = params.edits[fieldName]

    input.edits[dbColumn] = value
  })

  // Validate the inputs
  const { id, edits } = validators.validate(input, {
    id: validators.uint().required(),
    edits: validators.object().keys({
      email: validators.email()
    })
  })

  await db(TABLES.USER)
    .where({ id })
    .update(edits)
  const user = await selectUser()
    .where({ id })
    .first()
  return user
}
