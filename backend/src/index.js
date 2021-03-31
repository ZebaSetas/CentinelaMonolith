require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT
const Repository = require('./repositories/repository')
const exposeRoutes = require('./routes/v1')
const app = express()
const Logger = require('./logger/centinela-logger')
const logger = new Logger(__filename)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var options = {
  explorer: true
}

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument
  , options));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors());
(async() => {
  try {
    await Repository.initRepository()
    await app.listen(port, function () {
      logger.info(`Centinela running on port ${port}`)
    })
  } catch (err) {
    logger.error(`Failed to start server: ${err}`)
    process.exit(1)
  }
})()

exposeRoutes(app)
