const Repository = require('../repositories/repository');

module.exports = class UserRepository {
  constructor() {}
  async findAll(limit, offset) {
    var query = Repository.User.find()
    if (limit) {
      query.limit = limit
    }
    if (offset) {
      query.skip = offset
    }
    return await Repository.User.findAll(query)
  }

  async findByEmail(email) {
    let query = {
      where: {
        email: email
      }
    }
    let result = await Repository.User.findOne(query)
    if (result)
      return result
    else
      throw new Error(`Could not find user with email ${email}`)
  }

  async findById(userId) {
    let query = {
      where: {
        id: userId
      }
    }
    query.attributes = ['id', 'name', 'email']
    try {
      let result = await Repository.User.findOne(query)
      return result
    } catch (err) {
      logger.err(err)
      throw new Error(`Could not find user with userId ${userId}`)
    }

  }

  async findAllByOrganizationId(id) {
    let query = {
      where: {
        organizationId: id
      }
    }
    query.attributes = ['id', 'name', 'email']
    let result = await Repository.User.findAll(query)
    if (result)
      return result
    else
      throw new Error(`Could not find users for organization ${id}`)
  }

  async create(data) {
    let user = await Repository.User.create(data)
    return user
  }

}
