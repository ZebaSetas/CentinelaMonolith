const Logger = require('../../logger/centinela-logger')
const MonitoringService = require('../services/monitoring-service')

const logger = new Logger(__filename)

module.exports = class MonitoringController {
  ping = async(req, res) => {
    var service = new MonitoringService()
    try {
      var initTime = new Date().getTime()
      var dataPong = await service.ping();
      logger.info(JSON.stringify(dataPong), initTime)
      return res.status(200).json(dataPong)
    } catch (err) {
      logger.error(err, initTime)
      return res.status(400).json({
        error: err
      });
    }
  }
}
