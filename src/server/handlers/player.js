const Assert = require('assert')

const Player = require('../../controllers/player')
const { getAuthToken, getUserFromToken } = require('../../lib/authorization')

const isString = (v) => (typeof v === 'string' || v instanceof String)
const isNumber = (v) => (typeof v === 'number' || v instanceof Number)

const isInvalidPlayer = (ctx) => {
  try {
    Assert(isString(ctx.first_name), '`first_name` must be a String')
    Assert(isString(ctx.last_name), '`last_name` must be a String')
    Assert(isNumber(ctx.rating), '`rating` must be a valid email address')
    Assert(isString(ctx.handedness), '`handedness` must be a String (left/right)')
    return false
  } catch(err) {
    return err
  }
}

// GET /api/players LIST PLAYERS
exports.listPlayers = (req, res) => {
  const authToken = getAuthToken(req.headers)

  Player.listPlayers(authToken, (err, players) => {
    if (err) res.status(500).json({ success: false, message: err })
    else res.status(200).json({ success: true, players })
  })
}

// POST /api/players CREATE PLAYER
exports.createPlayer = (req, res) => {
  const invalidPlayer = isInvalidPlayer(req.body)

  if (invalidPlayer) return res.status(409).json({ success: false, message: invalidPlayer })

  const authToken = getAuthToken(req.headers)

  getUserFromToken(authToken, (err, user) => {
    if (err) return res.status(409).json({ success: false, message: err })

    const newPlayer = Object.assign({}, req.body, { created_by: user.id })

    Player.createPlayer(newPlayer, (err, player) => {
      if (err) res.status(409).json({ success: false, message: err })
      else res.status(201).json({ success: true, player })
    })
  })
}

// DELETE /api/players/:id DELETE PLAYER
exports.deletePlayer = (req, res) => {
  const authToken = getAuthToken(req.headers)

  Player.deletePlayer(req.params.id, authToken, (err) => {
    if (err) res.status(404).json({ success: false, message: err })
    else res.status(200).json({ success: true })
  })
}
