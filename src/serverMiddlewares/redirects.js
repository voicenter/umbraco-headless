import {JSONPath} from 'jsonpath-plus'
import {join} from 'path'
import {writeFileSync} from 'fs'

function getRedirects(moduleOptions) {
  const umbracoData = require(`${moduleOptions.rootDir}/static/UmbracoData.json`)

  // Get root umbraco elements
  const rootChildren = JSONPath(moduleOptions.redirects.rootChildrenUmbracoPath, umbracoData)[0] || {}

  // Find redirects folder
  const redirectsFolder = Object.keys(rootChildren).find(key => key.includes(moduleOptions.redirects.redirectFolderName))
  const redirectsArray = []

  if (!redirectsFolder) {
    return []
  }

  // Get redirects elements
  const redirects = JSONPath(`${moduleOptions.redirects.rootChildrenUmbracoPath}.${redirectsFolder}.children`, umbracoData)[0]

  // Map redirects elements to the format of [{oldUrl, newUrl}]
  Object.values(redirects).forEach(({oldUrl, newUrl}) => {
    redirectsArray.push({
      oldUrl,
      newUrl
    })
  })

  return redirectsArray
}

export default function setupRedirects(moduleOptions) {
  const redirectUrls = getRedirects(moduleOptions)

  const redirectsFilePath = join(moduleOptions.rootDir, 'static', '_redirects')

  const redirectsString = redirectUrls
    .map(({oldUrl, newUrl}) => `${encodeURI(oldUrl)} ${encodeURI(newUrl)} 301`)
    .join('\n')

  writeFileSync(redirectsFilePath, redirectsString)

  this.addServerMiddleware((req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production'
    const enableInDevelopment = moduleOptions.redirects.enableInDevelopment

    if (req.method === 'POST' || (!isProduction && !enableInDevelopment)) {
      next()

      return
    }

    const urlRedirect = redirectUrls.find(url => url.oldUrl === req.url || encodeURI(url.oldUrl) === req.url)

    if (!urlRedirect) {
      next()

      return
    }

    const url = urlRedirect ? urlRedirect.newUrl : req.url

    res.writeHead(301, {Location: encodeURI(url)})
    res.end()
  })
}
