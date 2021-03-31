require('dotenv').config()
const Logger = require('../logger/centinela-logger')
const logger = new Logger(__filename)
const Queue = require('bull')

module.exports = class QueueService {
  constructor(queueName) {
    this.queue = new Queue(queueName, {
      redis: {
        port: process.env.REDIS_PORT
        , host: process.env.REDIS_HOST
        , password: process.env.REDIS_PASSWORD
      }
    })
    this.queue.on('error', (e) => {
      logger.error(`Error connecting to Queue service: ${e.message}`)
      process.exit(1)
    });
  }

  async add(data, queueOptions = this.QUEUE_DEFAULT_OPTIONS) {
    try {
      return await this.queue.add(data, queueOptions)
    } catch (err) {
      throw new Error(`Could not queue job, Reason ${err.message}`)
    }
  }

  async process(func) {
    return await this.queue.process(func)
  }

  QUEUE_DEFAULT_OPTIONS = {
    removeOnComplete: true
    , removeOnFail: false
    , attempts: 3
    , backoff: {
      type: 'exponential'
      , delay: 120000 //3600000
    , }
  };
}
