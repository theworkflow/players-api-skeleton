const JWT = require('jsonwebtoken')

const { secret } = require('../config')
const { User: UserModel } = require('../models')

exports.createToken = (user) => JWT.sign(user, secret, { expiresIn: '1d' })

exports.getAuthToken = (headers) => {
  if (!headers || !headers['authorization']) return false
  if (headers['authorization'].split(' ')[0] !== 'Bearer') return false
  return headers['authorization'].split(' ')[1]
}

exports.validateToken = (req, res, next) => {
  const token = exports.getAuthToken(req.headers)

  if (!token) return res.status(403)
    .json({ success: false, message: 'Bearer token required' })

  JWT.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401)
      .json({ success: false, message: 'Failed to authenticate token.' });

    req.decoded = decoded
    next()
  })
}

exports.getUserFromToken = (token, done) => {
  JWT.verify(token, secret, (err, { _doc }) => {
    if (err) return done(err)
    UserModel.findById(_doc._id, done)
  })
}
