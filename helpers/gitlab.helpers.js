const axios = require('axios')
const uriHelpers = require('../service-library/helpers/uri.helpers')
const logger = require('../service-library/helpers/logger.helpers')
const stringHelpers = require('../service-library/helpers/string.helpers')

/* How to use

{endpointName}/[{projectId}][{branch}]/{filePath}

eg: gitlab/[32339499][main]chart%2Fvalues.yaml

you can use multiple files by separating them with a comma
you can also omit the branch name, it will default to main
eg. gitlab/[32339499]chart%2Fvalues.yaml

*/

const downloadFile = async (endpoint, docs) => {
  const token = endpoint.data.token
  const headers = {
    'PRIVATE-TOKEN': token
  }

  logger.debug('endpoint.data.token=' + endpoint.data.token)
  logger.debug('endpoint.target=' + endpoint.target)
  logger.debug('docs=' + docs)

  const regex = /(?<=\[)[^\][]*(?=])/gm

  return await Promise.all(
    docs.split(',').map(async (p) => {
      const scopes = p.match(regex)
      let name = p.split(']')
      name = encodeURIComponent(name[name.length - 1].trim())

      const api = uriHelpers.concatUrl([
        endpoint.target,
        '/api/v4/projects/',
        scopes[0],
        'repository/files/',
        name,
        'raw?ref=' + (scopes[1] || 'main')
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
