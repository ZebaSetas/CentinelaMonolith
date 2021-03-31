const Logger = require('../logger/centinela-logger')
const logger = new Logger(__filename)
const {
  v4: uuidv4
} = require('uuid')
const OrganizationService = require('../services/organization-service')

module.exports = class OrganizationController {
  constructor() {
    this.organizationService = new OrganizationService()
  }

  getOrganization = async(req, res) => {
    const initTime = new Date().getTime()
    const guid = uuidv4()
    const organizationId = Number.parseInt(req.params.id)
    logger.debug(
      `Arrived request to get organization, id: ${organizationId}`
      , initTime
      , guid)
    try {
      var organization = await this.organizationService.getById(
        organizationId)
      return res.status(200).json({
        organization
      })
    } catch (err) {
      logger.error(
        `There was an issue getting organization with id: ${organizationId}. Details: ${err.message}`
        , initTime
        , guid)
      return res.status(400).json({
        error: err.message
      });
    }
  }
}
