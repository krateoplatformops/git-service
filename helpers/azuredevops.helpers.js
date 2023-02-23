const axios = require('axios')
const logger = require('../service-library/helpers/logger.helpers')
const stringHelpers = require('../service-library/helpers/string.helpers')
const uriHelpers = require('../service-library/helpers/uri.helpers')

const downloadFile = async (endpoint, docs) => {
  const token = endpoint.data.token
  const headers = {
    Authorization: `Basic ${stringHelpers.to64(':' + token)}`,
    accept: '*/*'
  }

  const regex = /(?<=\[)[^\][]*(?=])/gm

  return await Promise.all(
    docs.split(',').map(async (p) => {
      const scopes = p.match(regex)
      let name = p.split(']')
      name = name[name.length - 1].trim()

      const apiUrl = uriHelpers.concatUrl([
        endpoint.target,
        scopes[0],
        scopes[1],
        '_apis/git/repositories',
        scopes[2],
        'items?path=',
        name + '&download=true?api-version=7.0'
      ])
      logger.debug(apiUrl)
      const file = await axios.get(apiUrl, {
        headers
      })

      logger.silly(file.data)
      return { name, content: stringHelpers.to64(file.data) }
    })
  )
}

module.exports = {
  downloadFile
}
