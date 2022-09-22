const express = require('express')
const router = express.Router()
const gitHubHelpers = require('../helpers/github.helpers')
const bitbucketHelpers = require('../helpers/bitbucket.helpers')
const logger = require('../service-library/helpers/logger.helpers')
const secretHelpers = require('../service-library/helpers/secret.helpers')

router.get('/:endpointName/:docs', async (req, res, next) => {
  try {
    const endpointName = req.params.endpointName
    const docs = req.params.docs

    // get endpoint
    const endpoint = await secretHelpers.getEndpoint(endpointName)
    logger.debug(endpoint)

    if (!endpoint) {
      return res.status(404).send({ message: 'Endpoint not found' })
    }

    let content = null
    switch (endpoint.metadata.type) {
      case 'github':
        res.status(200).json({
          list: await gitHubHelpers.downloadFile(endpoint, docs)
        })
        break
      case 'bitbucket':
        res.status(200).json({
          list: await bitbucketHelpers.downloadFile(endpoint, docs)
        })
        break
      default:
        throw new Error(`Unsupported endpoint ${parsed.domain}`)
    }
  } catch (error) {
    next(error)
  }
})

// router.get('/repository/:endpoint/:url', async (req, res, next) => {
//   try {
//     const parsed = uriHelpers.parse(stringHelpers.b64toAscii(req.params.url))

//     logger.debug(JSON.stringify(parsed))

//     const endpoint = JSON.parse(stringHelpers.b64toAscii(req.params.endpoint))

//     switch (endpoint?.type) {
//       case 'github':
//         res.status(200).json({
//           base: uriHelpers.concatUrl([
//             parsed.schema + '://',
//             parsed.domain,
//             parsed.pathList[0],
//             parsed.pathList[1]
//           ])
//         })
//         break
//       case 'bitbucket':
//         res.status(200).json({
//           base: uriHelpers.concatUrl([
//             parsed.schema + '://',
//             parsed.domain,
//             parsed.pathList[0],
//             parsed.pathList[1],
//             parsed.pathList[2],
//             parsed.pathList[3]
//           ])
//         })
//         break
//       default:
//         throw new Error(`Unsupported endpoint ${parsed.domain}`)
//     }
//   } catch (error) {
//     next(error)
//   }
// })

module.exports = router
