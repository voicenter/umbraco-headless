export default {
  getUmbracoDataAPI: 'https://www.voicenter.com/umbraco-data/',
  generateUmbracoDataAPI: 'https://umbraco-api.voicenter.co',
  site: 'voice-he-prod',
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
