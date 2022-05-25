const axios = require('axios')
const uriHelpers = require('./uri.helpers')
const stringHelpers = require('./string.helpers')
const timeHelpers = require('./time.helpers')

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

  const token = endpoint.secret.find((x) => x.key === 'token')

  const response = await axios.get(api, {
    headers: {
      Authorization: `token ${token.val}`
    }
  })
  return stringHelpers.b64toAscii(response.data.content)
}

module.exports = {
  downloadFile
}
