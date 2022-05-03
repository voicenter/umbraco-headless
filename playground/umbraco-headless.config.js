export default {
  getUmbracoDataAPI: 'https://voicenter-umbraco-data.voicenter-ltd.workers.dev/',
  nodeID: process.env.NODE_ID,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  modePath: 'SiteData.mode',
  redirects: {
    enable: true,
    redirectFolderName: 'redirectFolder',
    rootChildrenUmbracoPath: 'SiteData.children',
    enableInDevelopment: true
  },
  prefetch: [
    {
      fetch: {
        type: 'contentType',
        pattern: 'websiteMainNavigation'
      },
      globalKey: 'websiteMainNavigation'
    }
  ],
}
