import initOptions from './options';
import generateUmbracoFiles from './generator'
import setupRoutes from './router';
import setupStore from './store';
import setupPlugin from './plugins';
import setupTrailingMiddleware from './serverMiddlewares/trailing';
import setupRedirects from './serverMiddlewares/redirects';

console.log('IN UMBRACO HEADLESS 1')

export default async function (moduleOptions) {
  console.log('IN UMBRACO HEADLESS', moduleOptions)
  const options = await initOptions.call(this, moduleOptions)

  console.log('OPTIONS', options)

  options.umbracoData = await generateUmbracoFiles.call(this, options)

  console.log('UMBRACO DATA', options.umbracoData)

  if (options?.redirects?.enable === true) {
    setupRedirects.call(this, options)
  }

  setupRoutes.call(this, options);
  setupStore.call(this, options);
  setupPlugin.call(this, options);

  if (options.trailingSlashRedirect === true) {
    setupTrailingMiddleware.call(this, options)
  }
}

module.exports.meta = require('../package.json');
