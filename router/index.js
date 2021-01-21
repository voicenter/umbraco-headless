import {resolve} from 'path';
const {readdirSync} = require('fs');

const setupRoutes = function (urlList) {
    // Get array of created pages
    const files = JSON.stringify(readdirSync(this.options.rootDir + '/pages'));

    // Convert files elements to string
    for (let file in files) {
        if (files.hasOwnProperty(file)) file = `"${file}"`
    }

    this.extendRoutes(function umbracoModuleExtendRoutes(routes) {
        urlList.forEach(function (url) {
            if (url.url === '' && url.TemplateAlias !== 'index') {
                return;
            }

            let componentName = url.TemplateAlias + '.vue';

            if (!files.includes(url.TemplateAlias + '.vue')) {
                console.warn('The ' + url.TemplateAlias + ' component is not created, redirecting the ' + url.url + ' route to the index.vue component.');

                componentName = 'index.vue';
            }

            const route = {
                name: url.nodeID,
                path: url.url,
                component: resolve('pages/' + componentName),
                meta: url
            }

            // Removes the automatically created routes by nuxt to prevent the duplicates
            const duplicateIndex = routes.findIndex(function (route) {
                return route.name === url.TemplateAlias
            })

            if (duplicateIndex !== -1) {
                routes.splice(duplicateIndex, 1)
            }

            routes.push(route)
        })
    });
}

exports.setupRoutes = setupRoutes;

