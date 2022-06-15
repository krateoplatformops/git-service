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
    'projects/',
    parsed.pathList[1],
    'repos',
    parsed.pathList[3],
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
  return stringHelpers.b64toAscii(response.data.content)
}

module.exports = {
  downloadFile
}
