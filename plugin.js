const fs = require('fs');

module.exports = function (moduleOptions) {
    const rootDit = this.options.rootDir;

    const UmbracoData = require(rootDit + '/static/UmbracoData.json');

    createUmbracoStore();
    createUmbracoPlugin();
    addUmbracoPlugin.call(this);
    extendNuxtRoutes.call(this);

    function createUmbracoStore() {
        const storeFileContent = `import data from '~/static/UmbracoData.json';\nexport const state = () => (data);`;
        const storeFileName = rootDit + '/store/Umbraco.js';

        fs.writeFileSync(storeFileName, storeFileContent)
    }

    function createUmbracoPlugin() {
        const umbracoPluginFileContent = `const UmbracoNuxt = require('umbraco-headless/UmbracoNuxt');\nexport default UmbracoNuxt;`;
        const umbracoPluginFileName = rootDit + '/plugins/NuxtUmbraco.js';

        fs.writeFileSync(umbracoPluginFileName, umbracoPluginFileContent)
    }

    function addUmbracoPlugin() {
        if (!this.options.plugins.includes('~/plugins/NuxtUmbraco.js')) {
            this.options.plugins.push('~/plugins/NuxtUmbraco.js')
        }
    }

    function extendNuxtRoutes() {
        let existingFunc = this.options.router.extendRoutes ?
            this.options.router.extendRoutes.toString() : null;

        if (existingFunc) {
            existingFunc = existingFunc.substring(
                existingFunc.indexOf("{") + 1,
                existingFunc.lastIndexOf("}")
            );
        }

        const UmbracoDataString = JSON.stringify(UmbracoData);

        const newFunc = `
        ${existingFunc ? existingFunc : ''}
        JSON.parse('${UmbracoDataString}').urlList.forEach(function (url) {
            const route = {
              name: url.nodeID,
              path: url.url,
              component: resolve('pages/' + url.TemplateAlias + '.vue'),
              meta: url
            }
    
            const duplicateIndex = routes.findIndex(function (route) {
              return route.name === url.TemplateAlias
            })
    
            if (duplicateIndex !== -1) {
              routes.splice(duplicateIndex, 1)
            }
    
            routes.push(route)
          })`;

        this.options.router.extendRoutes = new Function('routes', 'resolve', newFunc)
    }
};

module.exports.meta = require('./package.json');
