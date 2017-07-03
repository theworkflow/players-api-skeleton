const { User: UserModel } = require('../models')
const { createToken } = require('../lib/authorization')

const findByEmail = (email, done) => UserModel.findOne({ email }, done)

exports.createAdminUser = (context, done) => {
  findByEmail(context.email, (err, result) => {
    if (err) return done(err)
    else if (result) return done('User already exists')

    const user = new UserModel(context)

    user.save((err) => {
      if (err) return done(err)

      const token = createToken(user)
      done(null, { user: user.toObject(), token })
    })
  })
}

exports.loginUser = (context, done) => {
  findByEmail(context.email, (err, user) => {
    if (err) return done(err)
    if (!user) return done('Invalid email/password')
    if (context.password !== user.password) return done('Invalid email/password')

    const token = createToken(user)
    done(null, { user: user.toObject(), token })
  })
}
