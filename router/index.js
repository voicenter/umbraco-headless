import {resolve} from 'path';
import removeTrailingSlash from "../helper/removeTrailingSlash";

const {readdirSync} = require('fs');

export default function setupRoutes(options) {
    // Get array of created pages
    const files = JSON.stringify(readdirSync(options.rootDir + '/pages'));

    // Convert files elements to string
    for (let file in files) {
        if (files.hasOwnProperty(file)) file = `"${file}"`
    }

    this.extendRoutes(function umbracoModuleExtendRoutes(routes) {
        options.umbracoData.urlList.forEach(function (url) {
            let componentName = url.TemplateAlias + '.vue';

            if (!files.includes(url.TemplateAlias + '.vue')) {
                if (!options.silent) {
                    console.warn('The ' + url.TemplateAlias + ' component is not created, redirecting the ' + url.url + ' route to the index.vue component.');
                }

                componentName = 'index.vue';
            }

            const route = {
                name: url.nodeID,
                path: options.trailingSlashRedirect ? removeTrailingSlash(url.url) : url.url,
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
