const BugRepository = require('../repositories/bug-repository')
const MailserService = require('./mailer-service')
const UserService = require('./user-service')
const BugQueue = require('./queue-service')

const config = require('config')
var Ajv = require('ajv')
const Role = require('../models/role')

var ajv = new Ajv({
  allErrors: true
  , verbose: true
})

const bugSchema = {
  "type": "object"
  , "properties": {
    "title": {
      "type": "string"
    }
    , "description": {
      "type": "string"
    }
    , "severity": {
      "type": "integer"
      , "minimum": 1
      , "maximum": 4
    }
    , "stateId": {
      "type": "integer"
    }
    , "user": {
      "type": "string"
    }
    , "environmentId": {
      "type": "integer"
    }
    , "organizationId": {
      "type": "integer"
    }
    , "systemId": {
      "type": "integer"
    }
  }
  , "additionalProperties": false
  , "required": ["title", "environmentId", "systemId", "organizationId"]
}

module.exports = class BugService {
  constructor() {
    this.repository = new BugRepository()
    this.mailer = new MailserService()
    this.userService = new UserService()
    this.bugQueue = new BugQueue('Bug Queue')
  }

  toModel(bug) {
    var environment = null
    var user = null
    var state = null
    var system = null
    if (bug.environment) {
      environment = {
        id: bug.environment.id
        , name: bug.environment.name
      }
    }
    if (bug.user) {
      user = {
        id: bug.user.id
        , name: bug.user.name
        , email: bug.user.email
      }
    }
    if (bug.state) {
      state = {
        id: bug.state.id
        , value: bug.state.value
      }
    }
    if (bug.system) {
      system = {
        id: bug.system.id
        , name: bug.system.name
      }
    }

    const modelBug = {
      id: bug.id
      , title: bug.title
      , description: bug.description
      , severity: bug.severity
      , environment: environment
      , state: state
      , system: system
      , user: user
    }

    return modelBug
  }

  bugsToModel(bugs) {
    var modelbugs = new Array();
    for (const bug of bugs) {
      modelbugs.push(this.toModel(bug))
    }
    return modelbugs
  }

  async getAll(limit, offset, state, order, organizationId) {
    var bugs = await this.repository.findAll(limit, offset, state, order
      , organizationId)
    return this.bugsToModel(bugs)
  }

  async queueBugCreation(bug, transactionGuid) {
    return await this.bugQueue.add({
      bug
      , transactionGuid
    }, BugQueue.QUEUE_DEFAULT_OPTIONS)
  }

  async createBug(bug, transactionGuid) {
    bug.stateId = config.state.pending_id
    var bugBD = await this.repository.create(bug, transactionGuid)
    let users = await this.userService.getAllUsersInOrganization(bug.organizationId)
      //user2 es solo un mock para hacer pruebas  
      //let users2 = ['mlsettimogmail.com', 'matiassettimo@gmail.com']
    this.mailer.sendNewBugEmail(bug, users)
    return bugBD
  }

  async updateBug(bug, transactionGuid, user) {
    var bugBd = await this.repository.findById(bug.id)
    if (bugBd == null) throw new Error('Bug with id ' + bug.id +
      ' does not exists')
    var role = user.role
    var userIsAdmin = role === 1
    if (!userIsAdmin) {
      this.validateUpdateBugForDeveloper(bug, bugBd)
    }
    if (bug.environment) {
      var env = bugBd.environment
      var newEnv = await bug.environment
      var enviromentIsUpdated = env.name != newEnv.name
      if (enviromentIsUpdated) throw new Error(
        'Error to update bug with id ' +
        bug.id + ': environment cannot be updated')
    }
    bugBd.title = bug.title
    bugBd.description = bug.description
    bugBd.severity = bug.severity
    if (bug.user) bugBd.userId = bug.user.id
    if (bug.state) bugBd.stateId = bug.state.id
    bugBd = await this.repository.update(bugBd, transactionGuid)
    return bugBd
  }

  validateUpdateBugForDeveloper(bug, bugBd) {
    if (bugBd.title != bug.title) throw Error(
      'Error to update bug with id ' +
      bug.id + ': title cannot be updated by a Developer user')
    if (bugBd.description != bug.description) throw Error(
      'Error to update bug with id ' +
      bug.id + ': description cannot be updated by a Developer user')
    if (bugBd.severity != bug.severity) throw Error(
      'Error to update bug with id ' +
      bug.id + ': severity cannot be updated by a Developer user')
  }

  validateBugToCreate(bug) {
    this.validateBug(bug)
    if (bug.stateId) throw Error(
      'Cannot create bug with defined state')
    if (bug.user) throw Error('Cannot create bug with defined user')
    return true
  }

  validateBugToUpdate(bug) {
    this.validateBug(bug)
    if (!bug.state) throw Error('Cannot update bug without state')
    return true
  }

  validateBug(bug) {
    var validate = ajv.compile(bugSchema)
    let isValid = ajv.validate(bug)
    if (!isValid) throw new Error(
      `The format of provided bug data is invalid: ${validate.errors[0].message}`
    )
    return isValid
  }

  async getById(id) {
    var bugBD = await this.repository.findById(id)
    return bugBD
  }
}
