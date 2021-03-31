require('dotenv').config()
require('newrelic')
const MonitoringService = require('./monitoring/services/monitoring-service')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT_MONITORING
const exposeRoutes = require('./monitoring/routes/v1')
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
    var service = new MonitoringService()
    var initTime = new Date().getTime()
    var dataPong = await service.ping();
    logger.info(JSON.stringify(dataPong), initTime)
    await app.listen(port, function () {
      logger.info(`Monitoring running on port ${port}`)
    })
  } catch (err) {
    logger.error(`Failed to start server: ${err}`)
    process.exit(1)
  }
})()

exposeRoutes(app)
