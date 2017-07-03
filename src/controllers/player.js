const { Player: PlayerModel } = require('../models')
const { getUserFromToken } = require('../lib/authorization')

const findPlayer = ({ first_name, last_name }, done) => PlayerModel.findOne({ first_name, last_name }, done)

exports.listPlayers = (authToken, done) => {
  let query

  getUserFromToken(authToken, (err, user) => {
    if (!err && user) query = { created_by: user.id }
    else query = {}

    PlayerModel.find({}, (err, players) => {
      if (err) return done(err)

      results = players.map(player => player.toObject())
        .filter(player => player.created_by === user.id)

      done(null, results)
    })
  })
}

exports.createPlayer = (context, done) => {
  findPlayer(context, (err, result) => {
    if (err) return done(err)
    else if (result) return done('Player already exists')

    const player = new PlayerModel(context)

    player.save((err) => {
      if (err) done(err)
      done(null, player)
    })
  })
}

exports.deletePlayer = (id, authToken, done) => {
  if (typeof id === 'undefined') return done('`id` required')
  if (typeof authToken === 'undefined') return done('`authToken` required')

  getUserFromToken(authToken, (err, user) => {
    if (err) return done(err)

    PlayerModel.findById(id, (err, result) => {
      if (err) return done(err)
      if (!result) return done('Player does not exist')
      if (result.created_by !== user.id) return done('Unauthorized')

      PlayerModel.findByIdAndRemove(id, (err) => {
        if (err) done(err)
        else done()
      })
    })

  })
}
