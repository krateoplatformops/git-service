const axios = require('axios')
const uriHelpers = require('../service-library/helpers/uri.helpers')
const stringHelpers = require('../service-library/helpers/string.helpers')
const logger = require('../service-library/helpers/logger.helpers')

const downloadFile = async (endpoint, docs) => {
  const bearer = endpoint.data['bearer']
  const headers = {
    Authorization: `Bearer ${bearer}`
  }

  const regex = /(?<=\[)[^\]\[]*(?=])/gm

  return await Promise.all(
    docs.split(',').map(async (p) => {
      const scopes = p.match(regex)
      let name = p.split(']')
      name = name[name.length - 1].trim()

      const api = uriHelpers.concatUrl([
        endpoint.target,
        'projects/',
        scopes[0],
        'repos',
        scopes[1],
        'raw',
        name
      ])

      logger.debug(api)

      const response = await axios.get(api, {
        headers
      })

      logger.debug(response.data)

      return { name, content: stringHelpers.to64(response.data) }
    })
  )
}

module.exports = {
  downloadFile
}
