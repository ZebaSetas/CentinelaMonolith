const Repository = require('../repositories/repository')
const Logger = require('../logger/centinela-logger')
const logger = new Logger(__filename)

module.exports = class OrganizationRepository {
  constructor() {}

  async save(data, transactionGuid) {
    try {
      let organization = await Repository.Organization.create(data, {
        include: ['user']
      })
      logger.debug(
        `Organization saved in BD with data: ${JSON.stringify(data)}`
        , transactionGuid)
      return organization.dataValues
    } catch (err) {
      logger.error(
        `Error saving to the database when creating Organization: ${JSON.stringify(data)} - ${err}`
        , transactionGuid)
      throw err
    }
  }

  async findById(organizationId) {
    try {
      let organization = await Repository.Organization.findOne({
        organizationId: organizationId
      })
      return organization
    } catch (err) {
      return null
    }
  }

  async findByName(name) {
    try {
      let organization = await Repository.Organization.findOne({
        name: name
        , include: ['user']
      })
      return organization
    } catch (err) {
      return null
    }
  }
}
