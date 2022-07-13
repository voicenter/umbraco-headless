import {resolve} from 'path';
import removeTrailingSlash from "../helper/removeTrailingSlash";

const {readdirSync} = require('fs');

export default function setupRoutes(options) {
  // Get array of created pages
  const files = readdirSync(options.rootDir + '/pages');

  this.extendRoutes(function umbracoModuleExtendRoutes(routes) {
    options.umbracoData.urlList.forEach(function (url) {
      let componentName = url.TemplateAlias + '.vue';

      if (!files.includes(url.TemplateAlias + '.vue')) {
        if (!options.silent) {
          console.warn('The ' + url.TemplateAlias + ' component is not created, redirecting the ' + url.url + ' route to the index.vue component.');
        }

        componentName = 'index.vue';
      }

      const path = options.trailingSlashRedirect ? removeTrailingSlash(url.url) : url.url

      const route = {
        name: url.nodeID,
        path: encodeURI(path),
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
