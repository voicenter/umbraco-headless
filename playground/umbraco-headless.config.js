export default {
  getUmbracoDataAPI: 'https://nuxt-umbraco-api.voicenter-ltd.workers.dev/',
  generateUmbracoDataAPI: 'http://localhost:3030',
  site: 'voice_he_prod',
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
