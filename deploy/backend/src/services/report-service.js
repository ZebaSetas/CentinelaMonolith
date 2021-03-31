const config = require('config')
const Logger = require('../logger/centinela-logger')
const BugRepository = require('../repositories/bug-repository')
var logger = new Logger(__filename)
const Repository = require('../repositories/repository')
const {
  Op
  , fn
  , col
} = require('sequelize')

module.exports = class ReportService {
  constructor() {
    this.bugRepository = new BugRepository()
  }

  async criticalBugsOfOrganization(organizationId) {
    try {
      let query = {
        include: [{
          model: Repository.State
          , attributes: ['value']
          , as: 'state'
        }, {
          model: Repository.System
          , attributes: ['name']
        }, {
          model: Repository.Environment
          , attributes: ['name']
        }, {
          model: Repository.User
          , attributes: ['name']
          , as: 'user'
        }, ]
        , order: [
          ['severity', 'DESC']
        ]
        , limit: 5
        , where: {
          organizationId: organizationId
          , stateId: config.state.pending_id
        }
        , attributes: ['id', 'title', 'description', 'severity']

      }
      return this.bugRepository.queryReport(query)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async statisticsForOrganizationBySeverity(organizationId, dateFrom, dateTo) {
    try {
      let query = {
        where: {
          organizationId: organizationId
          , createdAt: {
            [Op.gt]: dateFrom
            , [Op.lt]: dateTo
          }
        }
        , group: ['severity']
        , attributes: ['severity', [fn('COUNT', col(
          'severity')), 'count']]
      }
      return this.bugRepository.queryReport(query)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async statisticsForOrganizationByState(organizationId, dateFrom, dateTo) {
    try {
      let query = {
        where: {
          organizationId: organizationId
          , createdAt: {
            [Op.gt]: dateFrom
            , [Op.lt]: dateTo
          }
        }
        , group: ['stateId']
        , attributes: ['stateId', [fn('COUNT', col(
          'severity')), 'count']]
      }
      return this.bugRepository.queryReport(query)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
