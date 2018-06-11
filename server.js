const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const apiAuthentication = require('./src/authentication')

const config = require('./config')

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Basic route.
app.get('/', (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.send(`Hello World!\n`)
})

// start route lojaVirtual
var authentication = express.Router()
authentication.use('/', apiAuthentication)

// Main routes are placed here.
app.use('/', [authentication])

app.listen(config.port,() => console.log(`Authentication Middleware started at port ${config.port}`))