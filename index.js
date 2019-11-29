const {resolve, join} = require('path');
const {readdirSync, readFileSync} = require('fs');
const {setupRoutes} = require('./router');

export default function (moduleOptions) {
    const options = {...moduleOptions};

    if (!options.namespace) options.namespace = 'Umbraco';

    const {namespace} = options;

    const UmbracoData = readFileSync(this.options.rootDir + '/static/UmbracoData.json', 'utf8');

    options[namespace] = typeof UmbracoData === 'string' ? JSON.parse(UmbracoData) : UmbracoData;

    setupRoutes.call(this, UmbracoData);

    if (!this.options.store) this.options.store = true;

    const pluginsToSync = [
        'store/index.js',
        'plugins/index.js'
    ];


    for (const pathString of pluginsToSync) {
        this.addPlugin({
            src: resolve(__dirname, pathString),
            fileName: join(namespace, pathString),
            options
        })
    }


    const foldersToSync = [
        'store/modules',
        'plugins/helpers'
    ];

    for (const pathString of foldersToSync) {
        const path = resolve(__dirname, pathString);

        for (const file of readdirSync(path)) {
            this.addTemplate({
                src: resolve(path, file),
                fileName: join(namespace, pathString, file),
                options
            })
        }
    }
}

module.exports.meta = require('./package.json');
