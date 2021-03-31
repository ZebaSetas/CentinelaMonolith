const Logger = require('../logger/centinela-logger')
const logger = new Logger(__filename)

module.exports = class IAliveController {
  ping = async(req, res) => {
    logger.info("pong")
    return res.status(200).json("pong")
  }
}
