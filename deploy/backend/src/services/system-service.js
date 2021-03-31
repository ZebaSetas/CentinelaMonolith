const SystemRepository = require('../repositories/system-repository')
const EnvironmentRepository = require('../repositories/environment-repository')
const TokenService = require('./token-service')

module.exports = class SystemService {
  constructor() {
    this.systemRepository = new SystemRepository()
    this.environmentRepository = new EnvironmentRepository()
  }

  async getById(systemId) {
    return await this.systemRepository.getById(systemId)
  }

  async getAllByOrganizationId(organizationId) {
    return await this.systemRepository.findAllByOrganizationId(
      organizationId)
  }

  async createSystem(newSystem) {
    const existingSystems = await this.getAllByOrganizationId(newSystem.organizationId)
    existingSystems.forEach(system => {
      if (system.name === newSystem.name)
        throw new Error(
          `Cannot create system, this organization already has a system named: ${system.name}`
        )
    })
    return await this.systemRepository.create(newSystem)
  }

  async getAllEnvironmentsBySystemId(systemId) {
    return await this.environmentRepository.findAllBySystemId(systemId)
  }

  async createEnvironment(data) {
    let newEnvironment = {
      name: data.envName
      , systemId: data.systemId
      , keyConnection: ''
    }
    const existingEnvironments = await this.getAllEnvironmentsBySystemId(
      data.systemId)

    existingEnvironments.forEach(environment => {
      if (environment.name === newEnvironment.name)
        throw new Error(
          `Cannot create environment, this system already has an environment named: ${newEnvironment.name}`
        )
    })
    const createdEnvironment = await this.environmentRepository.create(
      newEnvironment)
    newEnvironment.environmentId = createdEnvironment.dataValues.id
    newEnvironment.organizationId = data.organizationId
    const token = TokenService.newNonExpiringToken(newEnvironment)

    return await this.environmentRepository.update({
        keyConnection: token
      }
      , newEnvironment.environmentId)
  }

}
