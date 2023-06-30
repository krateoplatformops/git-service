const axios = require('axios')
const logger = require('../service-library/helpers/logger.helpers')
const stringHelpers = require('../service-library/helpers/string.helpers')
const uriHelpers = require('../service-library/helpers/uri.helpers')

/* How to use

{endpointName}/[{organization}][{project}][{repositoryId}][{branch}]/{filePath}

eg. azure/[Kiratech][Krateo-microservices][krateo-template-aks][krateo]deployment.yaml

you can use multiple files by separating them with a comma
you can also omit the branch name

eg. azure/[Kiratech][Krateo-microservices][krateo-template-aks]deployment.yaml

you can also specify the branch by query parameter

eg. azure/[Kiratech][Krateo-microservices][krateo-template-aks]deployment.yaml&version=main

please note the & and not the ? before version

*/

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
      const name = p.split(']')
      const ff = name[name.length - 1].trim().split('&')

      const apiUrl = uriHelpers.concatUrl([
        endpoint.target,
        scopes[0],
        scopes[1],
        '_apis/git/repositories',
        scopes[2],
        'items?path=',
        ff[0] +
          '&download=true&api-version=7.0' +
          (ff.length > 1 ? '&' + ff.splice(1).join('&') : '') +
          (scopes[3] ? '&version=' + scopes[3] : '')
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
