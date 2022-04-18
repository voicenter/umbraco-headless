
## umbraco-headless
Nuxt module that helps you to easily load your Umbraco data directly into your great Nuxt project.

## Setup:
1. Update your server with this [extension](https://github.com/voicenter/umbraco-headless-api)
2. Install dependency by running `npm i @voicenter/umbraco-headless`
3. Configure your nuxt project by adding the following:

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
The following options can be specified while setting the module:

|        Option             |                    Description                                         |   Default   |
|---------------------------|:-----------------------------------------------------------------------|:-----------:|
|       namespace           | The name of the Vuex module where data will be put                     |   Umbraco   |
|     dataFilename          | The name of the Umbraco Data json file                                 | UmbracoData |
|  trailingSlashRedirect    | The value makes a 301 redirection to a non trailing slash URL          |    false    |
|       prefetch            | Array of objects, that will be fetched and saved in your Vuex store    |      []     |

4. Make sure you have all the created components in your pages folder. But if you don't have all the needed components - the plugin will setup the index.vue component for all the missing components routes.

:warning: Be aware that this module will automatically setup the Vuex storage for your Nuxt project.

###2. Possible options of configuring the package inside nuxt.config.js
```js
    umbracoHeadless: {
    namespace: 'String',                          // Name of the Vuex module where data will be put
    dataFileName: 'String',                       // Name of the Umbraco Data json file
    trailingSlashRedirect: true || false,         // true value makes a 301 redirection to a non trailing slash URL,
    prefetch: []                                  // Array of objects, that will be fetched and saved in your Vuex Store, default []
}
```
Template is below
```js
 umbracoHeadless: {
        namespace: 'Umbraco',
        dataFileName: 'UmbracoData',
        trailingSlashRedirect: true || false,
        getUmbracoDataAPI: 'someapi.com', // an API where plugin will do fetch reuqests to load Umbraco Data
        prefetch: [
            {
                fetch: {
                    type: 'contentType || path',
                    pattern: value,                 // contentType or jpath value
                    
                },
                globalKey: 'globalKeyString',       // Your Component is available from
                                                    // Vuex store $store.getters['Umbraco/getGlobalDataByKey']('globalKeyString')
                ignore: [
                    {
                        key: [''],                  // Array of Component Fields that you need to ignore, their values will be null
                        excludeStartLevel: 0        // Nesting level of your Component Fields you want to ignore, their values will be null
                    }
                ],
            },
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
Or if you provided custom namespace:
```js
    async asyncData (context) {
        const data = await context.$[your_namespace].get(context, {
            fetch: {
                type: 'path',
                pattern: context.route.meta[0].Jpath
            },
            apiOnly: true || false                  // If apiOnly true your page will be fetched from api
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
