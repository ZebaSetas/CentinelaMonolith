const axios = require('axios')
const Logger = require('../../logger/centinela-logger')
const logger = new Logger(__filename, '')

module.exports = class CentinelaAliveRequest {
  constructor() {}
  isAlive = async() => {
    var url = this.getStateURl()
    const instance = axios.create({
      baseURL: url
    })
    var initTime = Date.now()
    var resp = await instance.get().catch(function (error) {
      var message = `Could not connect with Centinela`
      logger.error(message + `: ${error.message}`)
      return message
    })
    if (!resp || !resp.data) {
      var message = `Centinela do not respond pong`
      logger.error(message, initTime)
      return message
    } else {
      logger.info(`Centinela ansewered: ${resp.data}`)
      return "pong"
    }
  }

  getStateURl = () => {
    let host = process.env.CENTINELA_HOST
    let port = process.env.CENTINELA_PORT
    let resource = process.env.CENTINELA_ALIVE_RESOURCE
    return `${host}:${port}${resource}`
  }

}
