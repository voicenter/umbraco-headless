const {readdirSync} = require('fs');

const setupRoutes = function (urlList) {
    // Retrieve already created extendRoutes function in nuxt config
    let existingFunc = this.options.router.extendRoutes ?
        this.options.router.extendRoutes.toString() : null;

    // If user have custom function - retrieve the function body
    if (existingFunc) {
        existingFunc = existingFunc.substring(
            existingFunc.indexOf("{") + 1,
            existingFunc.lastIndexOf("}")
        );
    }

    // Get array of created pages
    const files = JSON.stringify(readdirSync(this.options.rootDir + '/pages'));

    // Convert files elements to string
    for (let file in files) {
        if (files.hasOwnProperty(file)) file = `"${file}"`
    }

    // Create function that will expand routes
    const newFunc = `
    // Init the array of files variable inside of the function
    const files = ${files};
    // Set the already created function if it is present
    ${existingFunc ? existingFunc : ''}
    // Set the parsed umbracoData to variable
    const urlList = ${urlList}; 
    urlList.forEach(function (url) {
        // Generate the component name
        let componentName = url.TemplateAlias + '.vue';

        // If the needed component didn't created - inform about it and redirect the route to default component
        if (!files.includes(url.TemplateAlias + '.vue')) {
          console.warn('The ' + url.TemplateAlias + ' component is not created, redirecting the ' + url.url + ' route to the index.vue component.');

          componentName = 'index.vue';
        }

        // The new route setup object
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
      })`;

    this.options.router.extendRoutes = new Function('routes', 'resolve', newFunc);
};

exports.setupRoutes = setupRoutes;

