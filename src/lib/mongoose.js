const Mongoose = require('mongoose')
const { mongo } = require('../config')

const options = {
  server: {
    auto_reconnect: true,
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  }
}

Mongoose.connect(mongo.uri, options)
Mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error', err)
  throw err
})

Mongoose.Promise = global.Promise

module.exports = Mongoose
