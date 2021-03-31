const moment = require('moment');
const Logger = require('../logger/centinela-logger')
const logger = new Logger(__filename)
const {
  v4: uuidv4
} = require('uuid')
const ReportService = require('../services/report-service')
module.exports = class UserController {
  constructor() {
    this.reportService = new ReportService()
  }

  critical = async(req, res) => {
    const initTime = new Date().getTime()
    const guid = uuidv4()

    let organizationId = req.bugData.organizationId

    logger.debug(`New request to obtain Critital Bugs not resolved}`
      , initTime, guid)
    try {
      var report = await this.reportService.criticalBugsOfOrganization(
        organizationId)
    } catch (err) {
      let errorMessage = `Error creating Report`
      logger.error(`${errorMessage}: ${err.message}`, initTime, guid)
      return res.status(400).json({
        error: errorMessage
        , trace: err.message
      })
    }
    const message = `Report created`
    logger.info(message, initTime, guid)
    return res.status(200).json(report)
  }

  statistics = async(req, res) => {
    const initTime = new Date().getTime()
    const guid = uuidv4()
    let organizationId = req.userData.organizationId
    logger.debug(
      `New request to obtain Statistics of Bugs by organization: From:[${req.query.dateFrom} - To:${req.query.dateTo}]`
      , initTime, guid)
    try {
      let dateFrom = moment(req.query.dateFrom, 'DD/MM/YYYY', true)
      let dateTo = moment(req.query.dateTo, 'DD/MM/YYYY', true)
      dateTo.add(1, 'd')
      if (!dateFrom.isValid() || !dateTo.isValid()) {
        throw new Error(`Error parsing date on the query string`)
      }
      logger.debug(`New dates for report From:[${dateFrom} - To:${dateTo}]`
        , initTime, guid)
      var bySeverity = await this.reportService.statisticsForOrganizationBySeverity(
        organizationId, dateFrom, dateTo)
      var byState = await this.reportService.statisticsForOrganizationByState(
        organizationId, dateFrom, dateTo)
    } catch (err) {
      let errorMessage = `Error creating Report`
      logger.error(`${errorMessage}: ${err.message}`, initTime, guid)
      return res.status(400).json({
        error: errorMessage
        , trace: err.message
      })
    }
    const message = `Report created`
    logger.info(message, initTime, guid)
    return res.status(200).json({
      bySeverity
      , byState
    })
  }
}
