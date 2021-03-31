const CentinelaPingService = require('./centinela-ping-service')
const RedisPingService = require('./redis-ping-service')
const PostgresPingService = require('./postgres-ping-service')
const SenderPingService = require('./sender-ping-service')
const QueueStatiscservice = require('./queue-statistics-service')
module.exports = class MonitoringService {
  constructor() {
    this.centinelaPing = new CentinelaPingService()
    this.redisPingService = new RedisPingService()
    this.postgresPingService = new PostgresPingService()
    this.senderPingService = new SenderPingService()
    this.emailQueueStatisticsService = new QueueStatiscservice(process.env.EMAIL_QUEUE)
    this.bugQueueStatisticsService = new QueueStatiscservice(process.env.BUG_QUEUE)
  }

  async ping() {
    var pingCentinela = await this.centinelaPing.isAlive()
    var pingRedis = await this.redisPingService.isAlive()
    var pingPostgre = await this.postgresPingService.isAlive()
    var pingWorker = await this.senderPingService.isAlive()
    var emailQueueStatitics = await this.emailQueueStatisticsService.getStatisticsQueue()
    var bugQueueStatitics = await this.bugQueueStatisticsService.getStatisticsQueue()
    return this.buildMessage(pingRedis, pingPostgre, pingWorker
      , pingCentinela, emailQueueStatitics, bugQueueStatitics)
  }

  buildMessage = (redisMsg, postgresBdMsg, senderEMailWorkerMsg
    , centinelaMsg, emailQueueStatitics, bugQueueStatitics) => {
    var statusIsOk = redisMsg === "pong" &&
      postgresBdMsg === "pong" &&
      senderEMailWorkerMsg === "pong" &&
      centinelaMsg === "pong"
    var status = "OK"
    if (!statusIsOk) {
      var status = "Alerted"
    }

    const message = {
      status: status
      , data: {
        redis: redisMsg
        , postgresBd: postgresBdMsg
        , senderEmailWorker: senderEMailWorkerMsg
        , centinela: centinelaMsg
        , emailQueueStatitics: emailQueueStatitics
        , bugQueueStatitics: bugQueueStatitics
      }
    }
    return message
  }

}
