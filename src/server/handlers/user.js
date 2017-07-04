const Assert = require('assert')
const IsEmail = require('isemail')

const User = require('../../controllers/user')

const isString = (v) => (typeof v === 'string' || v instanceof String)
const isNumber = (v) => (typeof v === 'number' || v instanceof Number)

const isInvalidAdmin = (ctx) => {
  try {
    Assert(isString(ctx.first_name), '`first_name` must be a String')
    Assert(isString(ctx.last_name), '`last_name` must be a String')
    Assert(isString(ctx.email), '`email` must be a valid email address')
    Assert(isString(ctx.password), '`password` must be a String')
    Assert(isString(ctx.confirm_password), '`confirm_password` must be a String')
    Assert.deepEqual(ctx.password, ctx.confirm_password, 'password/password_confirm must match')
    return false
  } catch(err) {
    return err
  }
}

// POST /api/user CREATE USER
exports.createAdminUser = (req, res) => {
  const invalidAdmin = isInvalidAdmin(req.body)

  if (invalidAdmin) return res.status(409).json({ success: false, message: invalidAdmin })

  User.createAdminUser(req.body, (err, results) => {
    if (err) res.status(409).json({ success: false, message: err })
    else res.status(201).json({ success: true, user: results.user, token: results.token })
  })
}

// POST /api/login USER LOGIN
exports.loginUser = (req, res) => {
  User.loginUser(req.body, (err, results) => {
    if (err) res.status(401).json({ success: false, message: err })
    else res.status(200).json({ success: true, user: results.user, token: results.token })
  })
}
