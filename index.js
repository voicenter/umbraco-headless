import initOptions from './options';
import setupRoutes from './router';
import setupApi from './api';
import setupStore from './store';
import setupPlugin from './plugins';

export default function (moduleOptions) {
    const options = initOptions.call(this, moduleOptions);

    setupRoutes.call(this, options);
    setupApi.call(this, options);
    setupStore.call(this, options);
    setupPlugin.call(this, options);
}

module.exports.meta = require('./package.json');
