const joi = require('joi')

const mongo = require('./components/mongo')
const envVars = {
  PORT: joi.number()
    .integer()
    .min(0)
    .max(65535)
    .default(5555),
  SECRET: joi.string()
    .default('dis-has-typos-4-a-reason')
}

const schema = joi.object(envVars).unknown().required()
const { error, value: env } = joi.validate(process.env, schema)

if (error) throw new Error(`Config validation error: ${error.message}`)

const config = { port: env.PORT, secret: env.SECRET }

module.exports = Object.assign({}, mongo, config)
