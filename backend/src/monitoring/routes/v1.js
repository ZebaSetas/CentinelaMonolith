const monitoringRoutes = require('./v1/monitoring-routes')

module.exports = (app) => {
  app.use('/monitoring/v1/', monitoringRoutes)
  app.get('/', (req, res) => {
    res.send('Monitoring v1')
  })
}
