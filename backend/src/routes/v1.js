const bugsRoutes = require('./v1/bugs-routes')
const usersRoutes = require('./v1/users-routes')
const loginRoutes = require('./v1/login-routes')
const systemRoutes = require('./v1/systems-routes')
const invitationRoutes = require('./v1/invitations-routes')
const organizationRoutes = require('./v1/organizations-routes')
const reportsRoutes = require('./v1/reports-routes')
const isAliveRoutes = require('./v1/is-alive-routes')

module.exports = (app) => {
  app.use('/api/v1/', isAliveRoutes)
  app.use('/api/v1/bugs', bugsRoutes)
  app.use('/api/v1/users', usersRoutes)
  app.use('/api/v1/login', loginRoutes)
  app.use('/api/v1/systems', systemRoutes)
  app.use('/api/v1/invitations', invitationRoutes)
  app.use('/api/v1/organizations', organizationRoutes)
  app.use('/api/v1/reports', reportsRoutes)
  app.get('/', (req, res) => {
    res.send('Centinela Backend v1')
  })
}
