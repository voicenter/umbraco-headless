const setupRoutes = function (UmbracoData) {
    let existingFunc = this.options.router.extendRoutes ?
        this.options.router.extendRoutes.toString() : null;

    if (existingFunc) {
        existingFunc = existingFunc.substring(
            existingFunc.indexOf("{") + 1,
            existingFunc.lastIndexOf("}")
        );
    }

    const newFunc = `
    ${existingFunc ? existingFunc : ''}
    const data = ${UmbracoData}; data.urlList.forEach(function (url) {
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

    this.options.router.extendRoutes = new Function('routes', 'resolve', newFunc);
};

exports.setupRoutes = setupRoutes;

