const BodyParser = require('body-parser')
const Express = require('express')
const JWT = require('jsonwebtoken')

const { port, secret } = require('../config')
const Routes = require('./routes')
const App = Express()

App.set('secret', secret)
App.use(BodyParser.urlencoded({ extended: false }))
App.use(BodyParser.json());

Routes(App)
App.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = App
