<h1 align="center">🔑umbraco-headless</h1>
<p align="center">
Nuxt module that helps you to easily load your Umbraco data directly into your great Nuxt project.
</p>

## Setup:
1. Install dependency by running `yarn add https://github.com/voicenter/umbraco-headless/`
2. Configure your nuxt project by adding the following:

```js
// nuxt.config.js
{
    modules: [
        // ...
        'custom-umbraco-headless'
    ]
}
```
Also you can provide the name for the plugin and store by passing the options object on module include (default name is 'Umbraco'):

```js
// nuxt.config.js
{
    modules: [
        // ...
        ['custom-umbraco-headless', { namespace: 'MyUmbracoNuxt' }]
    ]
}
```
3. Make sure you have `UmbracoData.json` file in static folder of your nuxt project.
4. Make sure you have all the created components in your pages folder

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

Returns the whole Umbraco Vuex store
