const Logger = require('../logger/centinela-logger')
const logger = new Logger(__filename)
const {
  v4: uuidv4
} = require('uuid')

const SystemService = require('../services/system-service')

module.exports = class SystemController {
  constructor() {
    this.systemService = new SystemService()

  }

  getSystems = async(req, res) => {
    const initTime = new Date().getTime()
    const guid = uuidv4()

    const organizationId = req.userData.organizationId
    logger.debug(
      `Arrived request to list all system in organization: ${organizationId}`
      , initTime
      , guid)
    try {
      var systems = await this.systemService.getAllByOrganizationId(
        organizationId)
      return res.status(200).json({
        systems
      })
    } catch (err) {
      let errorMessage = "Error getting the list of systems from DB"
      logger.error(errorMessage, initTime, guid)
      return res.status(400).json({
        error: errorMessage
        , trace: err
      })
    }
  }

  createSystem = async(req, res) => {
    const initTime = new Date().getTime()
    const guid = uuidv4()
    const systemName = req.body.name
    const organizationId = req.userData.organizationId
    logger.debug(
      `Arrived request to create system \"${systemName}\" in organization ${organizationId}`
      , initTime
      , guid)

    let newSystem = {
      name: systemName
      , organizationId: organizationId
    }
    try {
      var system = await this.systemService.createSystem(newSystem)
      return res.status(201).json({
        system
      })
    } catch (err) {
      let errorMessage = `Error saving system: ${err.message}`
      logger.error(errorMessage, initTime, guid)
      return res.status(400).json({
        error: errorMessage
      })
    }
  }

  getEnvironments = async(req, res) => {
    const initTime = new Date().getTime()
    const guid = uuidv4()

    const organizationId = req.userData.organizationId
    const systemId = req.params.id
    logger.debug(
      `Arrived request to list all environments in system: ${systemId}`
      , initTime
      , guid)
    try {
      var environments = await this.systemService.getAllEnvironmentsBySystemId(
        systemId)
      return res.status(200).json({
        environments
      })
    } catch (err) {
      let errorMessage = "Error getting the list of environments from DB"
      logger.error(errorMessage, initTime, guid)
      return res.status(400).json({
        error: errorMessage
        , trace: err
      })
    }
  }

  createEnvironment = async(req, res) => {
    const initTime = new Date().getTime()
    const guid = uuidv4()

    const systemId = req.params.id
    const envName = req.body.name
    const organizationId = req.userData.organizationId
    logger.debug(
      `Arrived request to create a new \"${envName}\" in system ${systemId}`
      , initTime
      , guid)

    let data = {
      organizationId
      , systemId
      , envName
    }
    try {
      var environment = await this.systemService.createEnvironment(data)
      return res.status(201).json({
        environment
      })
    } catch (err) {
      let errorMessage = `Error saving environment: ${err.message}`
      logger.error(errorMessage, initTime, guid)
      return res.status(400).json({
        error: errorMessage
      })
    }
  }
}
