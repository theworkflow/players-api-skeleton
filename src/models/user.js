const Config = require('../config')
const Mongoose = require('../lib/mongoose')

const UserSchema = new Mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  date: { type: Date, index: true }
})

// apply transform for toObject by default
if ( ! UserSchema.options.toObject) {
  UserSchema.options.toObject = {};
}

UserSchema.options.toObject.transform = (doc, ret) => {
  // Use the hex string representation of the ObjectID as the id.
  ret.id = ret._id;

  // remove the _id and __v of every document before returning the result
  delete ret._id;
  delete ret.__v;
}

const UserModel = Mongoose.model('User', UserSchema)

module.exports = UserModel
