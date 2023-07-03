import {resolve, join} from 'path'
import {existsSync, mkdirSync, writeFileSync} from 'fs'

import ApiWorker from './util/ApiWorker'

export default async function generateUmbracoFiles(options) {
  const apiWorker = new ApiWorker(options)

  const umbracoData = await apiWorker.getJsonData()
  const robotsText = await apiWorker.getRobotsTxt()
  const siteMapXML = await apiWorker.getSitemapXML()

  const staticPath = join(options.rootDir, 'static')

  if (!existsSync(staticPath)) {
    console.log('static not exists')
    mkdirSync('static')
  }

  const umbracoDataPath = resolve(staticPath, options.dataFilename)
  const robotsTextPath = resolve(staticPath, 'robots.txt')
  const siteMapPath = resolve(staticPath, 'sitemap.xml')

  writeFileSync(umbracoDataPath, JSON.stringify(umbracoData, null, 2))
  writeFileSync(robotsTextPath, robotsText)
  writeFileSync(siteMapPath, siteMapXML)

  return umbracoData
}
