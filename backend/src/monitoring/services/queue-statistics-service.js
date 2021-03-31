require('dotenv').config()
const Queue = require('bull');
const Logger = require('../../logger/centinela-logger')
const logger = new Logger(__filename, '')

module.exports = class QueueStatiscservice {
  constructor(nameQueue) {
    this.nameQueue = nameQueue
    this.queue = null
  }

  async buildQueue() {
    try {
      var queue = new Queue(this.nameQueue, {
        redis: {
          port: process.env.REDIS_PORT
          , host: process.env.REDIS_HOST
          , password: process.env.REDIS_PASSWORD
        }
      });
      queue.on('error', (e) => {
        var message = `Error connecting to Queue service: ${e}`
        queue.close(true)
        return message
      });
      return queue
    } catch (err) {
      var message = `Error connecting to Queue service`
      logger.error(`${message}: ${err}`)
      return message
    }
  }

  async getStatisticsQueue() {

    if (!this.queue) this.queue = await this.buildQueue()
    if (!this.emailQueuel) {
      try {
        var statistics = await this.queue.getJobCounts().then(res => {
          const result = {
            delayed: res.delayed
            , waiting: res.waiting
            , active: res.active
            , failed: res.failed
            , completed: res.completed
            , paused: res.paused
          }
          return result
        }).catch(e => {
          logger.error(e)
          return 'Could not get queue statistics'
        })
        return statistics
      } catch (err) {
        logger.error(err)
        return 'Could not get queue statistics'
      }
    }
  }

}
