const Config = require('../config')
const Mongoose = require('../lib/mongoose')

const PlayerSchema = new Mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  rating: { type: Number, required: true },
  handedness: { type: String, enum: ['left', 'right'], required: true },
  date: { type: Date, index: true, default: new Date() },
  created_by: { type: String, default: null }
})

// apply transform for toObject by default
if ( ! PlayerSchema.options.toObject) {
  PlayerSchema.options.toObject = {};
}

PlayerSchema.options.toObject.transform = (doc, ret) => {
  // Use the hex string representation of the ObjectID as the id.
  ret.id = ret._id;

  // remove the _id and __v of every document before returning the result
  delete ret._id;
  delete ret.__v;
}

const PlayerModel = Mongoose.model('Player', PlayerSchema)

module.exports = PlayerModel
