const axios = require('axios')
const uriHelpers = require('./uri.helpers')
const stringHelpers = require('./string.helpers')
const { logger } = require('./logger.helpers')

const downloadFile = async (
  endpoint,
  parsed,
  fileName = parsed.pathList[parsed.pathList.length - 1]
) => {
  const api = uriHelpers.concatUrl([
    endpoint.target,
    'repos/',
    parsed.pathList[0],
    parsed.pathList[1],
    'contents',
    fileName
  ])

  logger.debug(api)

  const token = endpoint.secret.find((x) => x.key === 'token')

  logger.debug(JSON.stringify(token))

  const response = await axios.get(api, {
    headers: {
      Authorization: `token ${token.val}`
    }
  })

  logger.debug(JSON.stringify(response.data))

  return stringHelpers.b64toAscii(response.data.content)
}

module.exports = {
  downloadFile
}
