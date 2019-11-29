const { readdirSync } = require('fs');

const setupRoutes = function (UmbracoData) {
    let existingFunc = this.options.router.extendRoutes ?
        this.options.router.extendRoutes.toString() : null;

    if (existingFunc) {
        existingFunc = existingFunc.substring(
            existingFunc.indexOf("{") + 1,
            existingFunc.lastIndexOf("}")
        );
    }

    const files = JSON.stringify(readdirSync('./plugins'));

    for (let a in files) {
        if (files.hasOwnProperty(a)) a = `"${a}"`
    }

    const newFunc = `
    const files = ${files};
    ${existingFunc ? existingFunc : ''}
    const data = ${UmbracoData}; data.urlList.forEach(function (url) {
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

        const duplicateIndex = routes.findIndex(function (route) {
          return route.name === url.TemplateAlias
        })

        if (duplicateIndex !== -1) {
          routes.splice(duplicateIndex, 1)
        }

        routes.push(route)
      })`;

    this.options.router.extendRoutes = new Function('routes', 'resolve', newFunc);
};

exports.setupRoutes = setupRoutes;

