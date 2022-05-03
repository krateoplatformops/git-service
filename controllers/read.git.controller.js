const express = require('express')
const router = express.Router()
const axios = require('axios')
const uriHelpers = require('../helpers/uri.helpers')
const gitHubHelpers = require('../helpers/github.helpers')
const { envConstants } = require('../constants')
const stringHelpers = require('../helpers/string.helpers')
const { logger } = require('../helpers/logger.helpers')

router.get('/repository/:url', async (req, res, next) => {
  try {
    const parsed = uriHelpers.parse(stringHelpers.b64toAscii(req.params.url))

    logger.debug(JSON.stringify(parsed))

    res.status(200).json({
      base: uriHelpers.concatUrl([
        parsed.schema + '://',
        parsed.domain,
        parsed.pathList[0],
        parsed.pathList[1]
      ])
    })
  } catch (error) {
    next(error)
  }
})

router.get('/file/:url/:filename', async (req, res, next) => {
  try {
    const parsed = uriHelpers.parse(stringHelpers.b64toAscii(req.params.url))

    logger.debug(JSON.stringify(parsed))

    const endpointUrl = uriHelpers.concatUrl([
      envConstants.ENDPOINT_URI,
      'domain',
      parsed.domain
    ])
    const endpoint = (await axios.get(endpointUrl)).data

    switch (endpoint?.type) {
      case 'github':
        const content = await gitHubHelpers.downloadFile(
          endpoint,
          parsed,
          stringHelpers.b64toAscii(req.params.filename)
        )
        res.status(200).json({
          content
        })
        break
      default:
        throw new Error(`Unsupported endpoint ${parsed.domain}`)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/pipeline/:url/:name', async (req, res, next) => {
  try {
    const parsed = uriHelpers.parse(stringHelpers.b64toAscii(req.params.url))

    const endpointUrl = uriHelpers.concatUrl([
      envConstants.ENDPOINT_URI,
      'domain',
      parsed.domain
    ])
    const endpoint = (await axios.get(endpointUrl)).data

    switch (endpoint?.type) {
      case 'github':
        const content = await gitHubHelpers.readActionsByName(
          endpoint,
          parsed,
          stringHelpers.b64toAscii(req.params.name)
        )
        res.status(200).json({
          content: content
        })
        break
      default:
        throw new Error(`Unsupported endpoint ${parsed.domain}`)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
