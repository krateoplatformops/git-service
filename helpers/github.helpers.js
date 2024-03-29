const axios = require('axios')
const uriHelpers = require('../service-library/helpers/uri.helpers')
const logger = require('../service-library/helpers/logger.helpers')

const downloadFile = async (endpoint, docs) => {
  const token = endpoint.data.token
  const headers = {
    Authorization: `token ${token}`
  }

  const regex = /(?<=\[)[^\][]*(?=])/gm

  return await Promise.all(
    docs.split(',').map(async (p) => {
      const scopes = p.match(regex)
      let name = p.split(']')
      name = name[name.length - 1].trim()

      const api = uriHelpers.concatUrl([
        endpoint.target,
        'repos/',
        scopes[0],
        scopes[1],
        'contents',
        name
      ])

      logger.debug(api)

      const response = await axios.get(api, {
        headers
      })

      logger.debug(response.data)

      return { name, content: response.data.content }
    })
  )
}

module.exports = {
  downloadFile
}
