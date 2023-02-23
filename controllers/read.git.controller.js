const express = require('express')
const router = express.Router()
const gitHubHelpers = require('../helpers/github.helpers')
const bitbucketHelpers = require('../helpers/bitbucket.helpers')
const azuredevopsHelpers = require('../helpers/azuredevops.helpers')
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
      case 'azuredevops':
        res.status(200).json({
          list: await azuredevopsHelpers.downloadFile(endpoint, docs)
        })
        break
      default:
        throw new Error(`Unsupported endpoint ${endpointName}`)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
