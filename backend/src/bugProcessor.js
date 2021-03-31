require('dotenv').config()
const Repository = require('./repositories/repository')
const Logger = require('./logger/centinela-logger')
const logger = new Logger(__filename)
const BugService = require('./services/bug-service')
const Queue = require('./services/queue-service')
const bugService = new BugService()
const processBugs = async(job, done) => {
  try {
    let bug = job.data.bug
    let transactionGuid = job.data.transactionGuid
    let result = await bugService.createBug(bug, transactionGuid)
    logger.info(
      `Bug ${result.id} was created successfully - JobId: ${job.id}`
    )
    logger.debug(
      `Bug ${result.id} was created successfully - DEBUG: ${JSON.stringify(result)}`
    )
    done(null, result)
  } catch (err) {
    done(new Error(`Error processing bug: ${err.message}`))
  }
}

(async() => {
  try {
    let bugQueue = new Queue('Bug Queue')
    await Repository.initRepository()
    logger.info(`Centinela Bug processor worker started`)
    bugQueue.process(processBugs)
  } catch (err) {
    logger.error(`Failed to start worker: ${err}`)
    process.exit(1)
  }
})()
