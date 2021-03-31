const UserRepository = require('../repositories/user-repository')
const HashService = require('./hash-service')
const Logger = require('../logger/centinela-logger')
const Ajv = require('ajv')

const logger = new Logger(__filename)
const ajv = new Ajv()
const userSchema = {
  "properties": {
    "name": {
      "type": "string"
    }
    , "email": {
      "type": "string"
      , "format": "email"
    }
    , "password": {
      "type": "string"
    }
  }
  , "required": ["name", "email", "password"]
}

module.exports = class UserService {
  constructor() {
    this.repository = new UserRepository()
  }

  async encryptPassword(user) {
    logger.debug(`Encrypting password for user ${user.name}`)
    user.password = await HashService.getHash(user.password)
    return user
  }

  toModel(user) {
    const resultUser = {
      id: user.id
      , name: user.name
      , email: user.email
    }
    return resultUser

  }

  create(user) {
    this.repository.save(user)
  }

  getAll(limit, offset) {
    return this.repository.findAll(limit, offset)
  }

  async create(user) {
    try {
      await this.repository.findByEmail(user.email)
    } catch (err) {
      //User does not exists
      let userToDB = await this.encryptPassword(user)
      let dbUser = await this.repository.create(userToDB)
      return this.toModel(dbUser)
    }
    throw new Error(
      `Cannot create user, user with ${user.email} alread exists`)
  }

  validate(user) {
    let valid = ajv.validate(userSchema, user)
    if (!valid)
      throw Error('The format data of provided user is invalid')
    return true
  }

  async getByEmail(email) {
    return await this.repository.findByEmail(email)
  }

  async getById(id) {
    return await this.repository.findById(id)
  }
  async getAllUsersInOrganization(id) {
    return await this.repository.findAllByOrganizationId(id)
  }
}
