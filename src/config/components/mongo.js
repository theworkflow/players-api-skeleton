// config/components/mongo.js
const joi = require('joi')

const envVars = {
  MONGO_URI: joi.string()
    .default('mongodb://localhost:27017/players-api-skeleton')
}

const schema = joi.object(envVars).unknown().required()
const { error, value: env } = joi.validate(process.env, schema)
if (error) throw new Error(`Config validation error: ${error.message}`)

const config = {
  mongo: { uri: env.MONGO_URI }
}

module.exports = config
