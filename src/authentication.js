const Promise = require('bluebird')
const express = require('express')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))

const util = require('./util')

var authenticationBypass = express.Router()

// Route middleware to verify the JWT sent from client.
var authenticate = function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  
  const verifyToken = (secret) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      })
    })
  }
  
  const hasToken = new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('Token not found!'))
    } else {
      resolve()
    }
  })
  
  hasToken.then(() => util.getSecretKey())
  .then(secretKey => verifyToken(secretKey))
  .then(decoded => {
    delete decoded['iat']
    delete decoded['exp']
    req.body = {
      ...req.body,
      ...decoded
    }
    next()
  })
  .catch(err => {
    console.log(err.error)
    res.status(403).json('Forbidden action')
  })
}

// authenticates users data and generates the token
// user signin
authenticationBypass.post('/signin', (req, res) => {
  let payload = req.body
  util.getLoginHost()
  .then(loginHost => util.autenticateUserLogin(loginHost, req))
  .then(() => util.getSecretKey())
  .then(secret => {
    const token = jwt.sign(
      payload,
      secret
    )
    res.status(200).send(token)
  })
  .catch(err => {
    console.log(err.error)
    res.status(err.statusCode).send(err.error)
  })
})

// endpoint without token checking
// user signup
authenticationBypass.post('/signup',(req, res) => {
  
  util.getLoginHost()
  .then(loginHost => util.requestSignUp(loginHost, req))
  .then(body => res.status(200).send(body))
  .catch(err => {
    console.log(err.error)
    res.status(err.statusCode).send(err.error)
  })
})

// route to bypass any request to the next service, if the is valid
authenticationBypass.use('/', [authenticate], (req, res) => {
  util.bypass(req, res)
})

module.exports = authenticationBypass
