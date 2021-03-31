const OrganizationRepository = require(
  '../repositories/organization-repository')
const Logger = require('../logger/centinela-logger')
const Ajv = require('ajv')

const logger = new Logger(__filename)

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const orgSchema = {
  "properties": {
    "name": {
      "type": "string"
    }
    , "user": {
      "type": "object"
    , }
  }
  , "required": ["name", "user"]
}

module.exports = class OrganizationService {
  constructor() {
    this.repository = new OrganizationRepository()
  }

  async getById(organizationId) {
    return await this.repository.findById(organizationId)
  }

  async create(organization, transactionGuid) {
    try {
      let result = await this.repository.save(organization, transactionGuid)
      return result
    } catch (err) {
      throw err
    }
  }

  validate(org) {
    let valid = ajv.validate(orgSchema, org)
    if (!valid) {
      logger.error(
        `Organization format was not validated ${JSON.stringify(org)}`)
      throw Error('Invalid organization format')
    }
    logger.debug(
      `Organization format was succefull validated ${JSON.stringify(org)}`
    )
    return true
  }
}
