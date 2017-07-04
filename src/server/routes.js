const User = require('./handlers/user')
const Player = require('./handlers/player')
const { validateToken } = require('../lib/authorization')

module.exports = (app) => {
  app.post('/api/user', User.createAdminUser)
  app.post('/api/login', User.loginUser)
  app.get('/api/players', validateToken, Player.listPlayers)
  app.post('/api/players', validateToken, Player.createPlayer)
  app.delete('/api/players/:id', validateToken, Player.deletePlayer)
}
