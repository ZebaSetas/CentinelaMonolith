var express = require('express')
const app = express()

app.get('/hola', (req, res) => {
  res.send({
    status: 'OK'
  })
})

module.exports = app
