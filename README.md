# umbraco-headless
The plugin that helps you to easily load your Umbraco data directly into your great Nuxt project.

# Installing:
1. Install dependency by running `yarn add https://github.com/voicenter/umbraco-headless/`
2. Configure your nuxt project by adding the following:

```
// nuxt.config.js
modules: [
    // ...
    'custom-umbraco-headless'
],
```
Also you can provide the name for the plugin and store by passing the options object on module include (default name is 'Umbraco'):

```
// nuxt.config.js
modules: [
    // ...
    ['custom-umbraco-headless', { namespace: 'MyUmbracoNuxt' }]
],
```
3. Make sure you have `UmbracoData.json` file in static folder of your nuxt project.
4. Make sure you have all the created components in your pages folder
5. Just add the following to your pages components:
```
asyncData (context) {
    return context.app.$Umbraco.LoadNuxtUmbracoData(context)
}
```
Or if you provided custom namespace:
```
asyncData (context) {
    return context.app.$[your_namespace].LoadNuxtUmbracoData(context)
}
```
6. Enjoy
