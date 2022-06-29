const express = require('express')
const router = express.Router()
const uriHelpers = require('../helpers/uri.helpers')
const gitHubHelpers = require('../helpers/github.helpers')
const bitbucketHelpers = require('../helpers/bitbucket.helpers')
const stringHelpers = require('../helpers/string.helpers')
const { logger } = require('../helpers/logger.helpers')

router.get('/repository/:endpoint/:url', async (req, res, next) => {
  try {
    const parsed = uriHelpers.parse(stringHelpers.b64toAscii(req.params.url))

    logger.debug(JSON.stringify(parsed))

    const endpoint = JSON.parse(stringHelpers.b64toAscii(req.params.endpoint))

    switch (endpoint?.type) {
      case 'github':
        res.status(200).json({
          base: uriHelpers.concatUrl([
            parsed.schema + '://',
            parsed.domain,
            parsed.pathList[0],
            parsed.pathList[1]
          ])
        })
        break
      case 'bitbucket':
        res.status(200).json({
          base: uriHelpers.concatUrl([
            parsed.schema + '://',
            parsed.domain,
            parsed.pathList[0],
            parsed.pathList[1],
            parsed.pathList[2],
            parsed.pathList[3]
          ])
        })
        break
      default:
        throw new Error(`Unsupported endpoint ${parsed.domain}`)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/file/:url/:endpoint/:name', async (req, res, next) => {
  try {
    const parsed = uriHelpers.parse(stringHelpers.b64toAscii(req.params.url))

    logger.debug(JSON.stringify(parsed))

    const endpoint = JSON.parse(stringHelpers.b64toAscii(req.params.endpoint))

    let content = null
    switch (endpoint?.type) {
      case 'github':
        content = await gitHubHelpers.downloadFile(
          endpoint,
          parsed,
          stringHelpers.b64toAscii(req.params.name)
        )
        break
      case 'bitbucket':
        content = await bitbucketHelpers.downloadFile(
          endpoint,
          parsed,
          stringHelpers.b64toAscii(req.params.name)
        )
        break
      default:
        throw new Error(`Unsupported endpoint ${parsed.domain}`)
    }
    res.status(200).json({
      content
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
