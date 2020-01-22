## umbraco-headless
Nuxt module that helps you to easily load your Umbraco data directly into your great Nuxt project.

## Setup:
1. Update your server with this [extension](https://github.com/voicenter/umbraco-headless-api)
2. Install dependency by running `yarn add https://github.com/voicenter/umbraco-headless/`
3. Configure your nuxt project by adding the following:

```js
// nuxt.config.js
{
    modules: [
        // ...
        'umbraco-headless'
    ]
}
```
Also you can provide the name for the plugin and store by passing the options object on module include (default name is 'Umbraco'):

```js
// nuxt.config.js
{
    modules: [
        // ...
        ['umbraco-headless', { namespace: 'MyUmbracoNuxt' }]
    ]
}
```
4. Make sure you have `UmbracoData.json` file in static folder of your nuxt project. 
5. Make sure you have all the created components in your pages folder. But if you don't have all the needed components - the plugin will setup the index.vue component for all the missing components routes.

:warning: Be aware that this module will automatically setup the Vuex storage for your Nuxt project. 

## Usage
Just add the following to your pages components:
```js
asyncData (context) {
    return context.app.$Umbraco.LoadNuxtUmbracoData(context)
}
```
Or if you provided custom namespace:
```js
asyncData (context) {
    return context.app.$[your_namespace].LoadNuxtUmbracoData(context)
}
```

## Available plugin methods

### `LoadNuxtUmbracoData`

Returns the data for your component from Vuex Store

### `log`

Logs to console the whole Umbraco Vuex store

### `LoadRootData`

Returns the root Umbraco data from Vuex store
