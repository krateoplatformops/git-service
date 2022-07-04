const axios = require('axios')
const uriHelpers = require('./uri.helpers')
const stringHelpers = require('./string.helpers')
const { logger } = require('./logger.helpers')

const downloadFile = async (
  endpoint,
  parsed,
  fileName = parsed.pathList[parsed.pathList.length - 1]
) => {
  let prj = parsed.pathList[0]
  let repo = parsed.pathList[1]
  if (parsed.pathList.length > 2) {
    prj = parsed.pathList[1]
    repo = parsed.pathList[3]
  }

  const api = uriHelpers.concatUrl([
    endpoint.target,
    'projects/',
    prj,
    'repos',
    repo,
    'raw',
    fileName
  ])

  logger.debug(api)

  const bearer = endpoint.secret.find((x) => x.key === 'bearer')

  const response = await axios.get(api, {
    headers: {
      Authorization: `Bearer ${bearer.val}`
    }
  })
  return response.data
}

module.exports = {
  downloadFile
}
