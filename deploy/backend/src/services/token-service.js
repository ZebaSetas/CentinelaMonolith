const jwt = require('jsonwebtoken')
const Logger = require('../logger/centinela-logger')
const logger = new Logger(__filename)

const tokenSecret = process.env.TOKEN_SECRET
const tokenDuration = process.env.TOKEN_DURATION

module.exports = class TokenService {
  constructor() {}
  static newToken(data) {
    const tokenExpiration = Math.floor(Date.now() / 1000) + parseInt(
      tokenDuration)
    const metadata = {
      data: data
      , exp: tokenExpiration
    }
    return generateToken(metadata)
  }

  static newNonExpiringToken(data) {
    const metadata = {
      data: data
    }
    return generateToken(metadata)
  }

  static verifyToken(token) {
    try {
      const initTime = new Date().getTime()
      logger.debug(`Token verification for token: ${token} initiated`
        , initTime)
      let result = jwt.verify(token, tokenSecret)
      logger.debug(`Token verification for token: ${token} completed`
        , initTime)
      return result
    } catch (err) {
      throw new Error(`Error verifying token ${err.message}`)
    }
  }
}

generateToken = (metadata) => {
  try {
    var initTime = new Date().getTime()
    logger.debug(
      `Initiating token request with data: ${JSON.stringify(metadata.data)}`
      , initTime)
    let token = jwt.sign(metadata, tokenSecret)
    logger.debug(
      `Done creating token request with data: ${JSON.stringify(metadata.data)}`
      , initTime)

    return token
  } catch (err) {
    let errorMessage = `Token creation failed with error ${err.message}`
    logger.error(errorMessage, initTime)
    throw new Error(errorMessage)
  }
}
