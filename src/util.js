const rp = require('request-promise')
const config = require('../config')

const getLoginHost = () => new Promise((resolve,reject) => {
  return config.loginHost ? resolve(config.loginHost) : reject(new Error('Login Host not found!'))
})

const getBypassHost = () => new Promise((resolve,reject) => {
  return config.bypassHost ? resolve(config.bypassHost) : reject(new Error('Bypass Host not found!'))
})

const requestSignIn = (host, req) => {
  const options = {
    method: 'POST',
    uri: `${host}/signin`,
    body: req.body,
    headers: req.headers,
    json: true
  }
  return rp(options)
}

module.exports = {

  getSecretKey: () => new Promise((resolve,reject) => {
    return config.secretKey ? resolve(config.secretKey) : reject(new Error('Secret Key not found!'))
  }),

  getLoginHost: getLoginHost,

  autenticateUserLogin: (body, req) => {
    return getLoginHost()
    .then(loginHost => requestSignIn(loginHost, req))
  },

  requestSignUp: (host, req) => {
    const options = {
      method: 'POST',
      uri: `${host}/signup`,
      body: req.body,
      headers: req.headers,
      json: true
    }
    return rp(options)
  },

  bypass: (req, res) => {
    getBypassHost()
      .then(bypassHost => {
        const host = bypassHost
        const url = req.url.substring(0, req.url.indexOf('?'))
        const options = {
          method: req.method,
          uri: `${host}${url}`,
          qs: {
            ...req.body,
            ...req.query
          },
          body: {
            ...req.body,
            ...req.query
          },
          headers: req.headers,
          json: true
        }
        return rp(options)
      })
      .then(body => {
        console.log(body)
        return res.status(200).send(body)
      })
      .catch(err => {
        console.log(err.error)
        res.status(err.statusCode).send(err.error)
      })
  }
}
