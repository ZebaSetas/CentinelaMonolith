const Logger = require('../logger/centinela-logger')
const logger = new Logger(__filename)
const {
  v4: uuidv4
} = require('uuid')

const UserService = require('../services/user-service')
const OrganizationService = require('../services/organization-service')
const Role = require('../models/role')

module.exports = class UserController {
  constructor() {
    this.userService = new UserService()
    this.organizationService = new OrganizationService()
  }

  createAdminUser = async(req, res) => {
    const initTime = new Date().getTime()
    const request = req.body
    const guid = uuidv4()
    logger.debug(
      `New request to create a new Admin user for new Organization, request is: ${JSON.stringify(request)}`
      , initTime, guid)
    try {
      this.organizationService.validate(request)
      this.userService.validate(request.user)
      request.user = await this.userService.encryptPassword(request.user)
      request.user.role = Role.ADMIN
      var organization = await this.organizationService.create(request
        , guid)
      var user = organization.user[0]
    } catch (e) {
      let errorMessage = `Error creating User: `
      logger.error(errorMessage + e, initTime, guid)
      return res.status(400).json({
        error: errorMessage
        , trace: e
      })
    }
    const message =
      `Admin user created for Organization ${organization.name}`
    logger.info(message, initTime, guid)
    return res.status(201).json({
      message
      , user: this.userService.toModel(user)
    })
  }

  getUsers = async(req, res) => {
    try {
      var organizationId = req.userData.organizationId
      var initTime = new Date().getTime()
      var guid = uuidv4()
      logger.debug('Arrived request to get users with data')
      var bugs = await this.userService.getAllUsersInOrganization(
        organizationId)
      logger.debug('Get users respond OK ', initTime, guid)
      return res.status(200).json((bugs))
    } catch (err) {
      logger.error(err, initTime)
      return res.status(400).json({
        error: err
      });
    }
  }
}
