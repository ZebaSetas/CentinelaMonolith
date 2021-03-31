const senderRoutes = require('./v1/sender-routes')

module.exports = (app) => {
  app.use('/sender/v1/', senderRoutes)
  app.get('/', (req, res) => {
    res.send('Sender v1')
  })
}
