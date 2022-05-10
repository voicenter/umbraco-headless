## umbraco-headless
Nuxt module that helps you to easily load your Umbraco data directly into your great Nuxt project.

## Setup:
1. Install dependency by running `npm i @voicenter/umbraco-headless` or `yarn add @voicenter/umbraco-headless`
2. Configure your nuxt project by adding the following:

```js
// nuxt.config.js
{
    modules: [
        // ...
        '@voicenter/umbraco-headless'
    ]
}
```
### Options:
In order to configure the module - create `umbraco-headless.config.js` file in the root of your Nuxt project.
The following options can be specified while setting the module:

| Option                            | Description                                                                                                                                | Default           | Required |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | :---------------: | :------: |
| getUmbracoDataAPI                 | An URI where plugin will do a POST requests in order to fetch Umbraco Data                                                                 | -                 | true     |
| generateUmbracoDataAPI            | An URI where plugin will do a POST requests in order to fetch sitemap.xml robots.txt, umbracodata.json to generate files                   | -                 | true     |
| site                              | The name of the website                                                                                                                    | -                 | true     |
| trailingSlashRedirect             | The value makes a 301 redirection to a non trailing slash URL                                                                              | false             | false    |
| redirects                         | -                                                                                                                                          | -                 | false    |
| redirects.enable                  | If to enable 301 redirects                                                                                                                 | false             | -        |
| redirects.redirectFolderName      | Name of the Umbraco Data content type where to find redirects (plugin will check children's `oldUrl`/`newUrl` key pairs)                   | redirectFolder    | -        |
| redirects.rootChildrenUmbracoPath | Path of the children content                                                                                                               | SiteData.children | -        |
| redirects.enableInDevelopment     | Whenever to do redirects in development mode                                                                                               | false             | -        |

Make sure you have all the created components in your pages folder. But if you don't have all the needed components - the plugin will setup the index.vue component for all the missing components routes.

:warning: Be aware that this module will automatically setup the Vuex storage for your Nuxt project.

Example:
```js
// umbraco-headless.config.js
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
  ]
}
```
## Usage
Just add the following to your pages components:
```js
async asyncData (context) {
    const data = await context.$Umbraco.get(context, {
        fetch: {
            type: 'path',
            pattern: context.route.meta[0].Jpath
        },
        apiOnly: true || false,                 // If apiOnly true your page will be fetched from api
                                                // If your Component is available in Vue store you set apiOnly false and your component
                                                // will be fetched from your Vuex store
    }) || {}
    return data;
}
```

If you want to fetch your Page by contentType:
```js
async asyncData (context) {
    const data = await context.$Umbraco.get(context, {
        fetch: {
            type: 'contentType',
            pattern: '[your content type value]'
        },
        apiOnly: true || false                 // If apiOnly true your page will be fetched from api
                                               // If your Component is available in Vue store you set apiOnly false and your component
                                               // will be fetched from your Vuex store
    }) || {}
    return data;
}
```
