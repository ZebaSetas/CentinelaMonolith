require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT_SENDER
const exposeRoutes = require('./sender/routes/v1')
const app = express()
const Logger = require('./logger/centinela-logger')
const logger = new Logger(__filename)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(cors());
(async() => {
  try {
    const MailService = require('./services/email-service')
    let mailService = new MailService();

    const Queue = require('./services/queue-service')
    let emailQueue = new Queue('Email Bug Queue')

    const sendEmail = async(job, done) => {
      let email = job.data
      try {
        let result = await mailService.sendEmail(
          email.address
          , email.subject
          , email.bodyText
          , email.bodyHTML
        )
        logger.info(
          `Email to ${email.address} was sent successfully - JobId: ${job.id}`
        )
        logger.debug(
          `Email to ${email.address} was sent successfully - DEBUG: ${JSON.stringify(result)}`
        )
        done(null, result);
      } catch (err) {
        logger.error(
          `Unable to send email to ${email.address}, REASON: ${err.message}`
        )
        done(new Error(`Error sending email ${err.message}`))
      }
    }

    emailQueue.process(sendEmail);
    await app.listen(port, function () {
      logger.info(
        `Centinela email sender worker started on port ${port}`
      )
    })
  } catch (err) {
    logger.error(`Failed to start server: ${err}`)
    process.exit(1)
  }
})()
exposeRoutes(app)
