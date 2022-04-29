import umbracoHeadless from '../src/index'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'playground',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  modules: [
    umbracoHeadless,
    '@nuxtjs/axios',
  ],
  umbracoHeadless: {
    getUmbracoDataAPI: 'https://voicenter-umbraco-data.voicenter-ltd.workers.dev/',
    prefetch: [
      {
        fetch: {
          type: 'path',
          pattern: '$'
        },
        include: [
          'mainClientsBlockTitle'
        ],
        globalKey: 'root',
      },
      {
        fetch: {
          type: 'contentType',
          pattern: 'websiteMainNavigation'
        },
        globalKey: 'websiteMainNavigation',
        include: [
          'createDate'
        ],
        ignore: [
          {
            key: [''],
            excludeStartLevel: 0
          }
        ]
      },
      {
        fetch: {
          type: 'contentType',
          pattern: 'websiteFooter'
        },
        globalKey: 'websiteFooterContent',
        ignore: [
          {
            key: [''],
            excludeStartLevel: 0
          }
        ]
      },
      {
        fetch: {
          type: 'contentType',
          pattern: 'siteClientsForm'
        },
        globalKey: 'siteClientsFormContent',
        ignore: [
          {
            key: [''],
            excludeStartLevel: 0
          }
        ]
      },
      {
        fetch: {
          type: 'contentType',
          pattern: 'sitePartnersForm'
        },
        globalKey: 'sitePartnersFormContent',
        ignore: [
          {
            key: [''],
            excludeStartLevel: 0
          }
        ]
      },
      {
        fetch: {
          type: 'contentType',
          pattern: 'errorPageContent'
        },
        globalKey: 'errorPageContent',
        ignore: [
          {
            key: [''],
            excludeStartLevel: 0
          }
        ]
      }
    ]
  },

  axios: {
    baseURL: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
