'use strict'

const needle = require('needle')
const test = require('ava')
const {
  createServer,
  createSecureServer,
  createProxy,
  createSecureProxy,
  PROXY_HOSTNAME,
  SERVER_HOSTNAME
} = require('./utils')
const { HttpProxyAgent, HttpsProxyAgent } = require('../')

test('http to http', async t => {
  const server = await createServer()
  const proxy = await createProxy()
  server.on('request', (req, res) => res.end('ok'))

  const response = await needle('get', `http://${server.address().address}:${server.address().port}`, {
    agent: new HttpProxyAgent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 256,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      proxy: `http://${proxy.address().address}:${proxy.address().port}`
    })
  })

  t.is(response.body.toString(), 'ok')
  t.is(response.statusCode, 200)

  server.close()
  proxy.close()
})

test('https to http', async t => {
  const server = await createServer()
  const proxy = await createSecureProxy()
  server.on('request', (req, res) => res.end('ok'))

  const response = await needle('get', `http://${server.address().address}:${server.address().port}`, {
    agent: new HttpProxyAgent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 256,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      proxy: `https://${PROXY_HOSTNAME}:${proxy.address().port}`
    })
  })

  t.is(response.body.toString(), 'ok')
  t.is(response.statusCode, 200)

  server.close()
  proxy.close()
})

test('http to https', async t => {
  const server = await createSecureServer()
  const proxy = await createProxy()
  server.on('request', (req, res) => res.end('ok'))

  const response = await needle('get', `https://${SERVER_HOSTNAME}:${server.address().port}`, {
    agent: new HttpsProxyAgent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 256,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      proxy: `http://${proxy.address().address}:${proxy.address().port}`
    })
  })

  t.is(response.body.toString(), 'ok')
  t.is(response.statusCode, 200)

  server.close()
  proxy.close()
})

test('https to https', async t => {
  const server = await createSecureServer()
  const proxy = await createSecureProxy()
  server.on('request', (req, res) => res.end('ok'))

  const response = await needle('get', `https://${SERVER_HOSTNAME}:${server.address().port}`, {
    agent: new HttpsProxyAgent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 256,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      proxy: `https://${PROXY_HOSTNAME}:${proxy.address().port}`
    })
  })

  t.is(response.body.toString(), 'ok')
  t.is(response.statusCode, 200)

  server.close()
  proxy.close()
})
