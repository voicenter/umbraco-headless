import {resolve, join} from 'path'
import {existsSync, mkdirSync, writeFileSync} from 'fs'

import DB_WORKER from './util/db'

export default async function generateUmbracoFiles(options) {
  const dbWorker = new DB_WORKER(options)

  await dbWorker.init()

  const umbracoData = dbWorker.getJsonData()
  const robotsText = await dbWorker.getRobotTXT()
  const siteMapXML = await dbWorker.getSiteMAP()

  const staticPath = join(options.rootDir, 'static')

  if (!existsSync(staticPath)) {
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
