const {resolve, join} = require('path');
const {readdirSync} = require('fs');
const {setupRoutes} = require('./router');
const DEFAULT_OPTIONS = {
    namespace: 'Umbraco',
    dataFilename: 'UmbracoData.json'
}

export default function (moduleOptions) {
    // Parse module options to var
    const options = {
        ...DEFAULT_OPTIONS,
        ...moduleOptions
    };

    const {
        namespace,
        dataFilename
    } = options;

    // Parse the UmbracoData.json data into options
    options[namespace] = require(`${this.options.rootDir}/static/${dataFilename}`);

    // Get the list of urls
    const urlList = options[namespace].urlList;

    // Extends the nuxt routes
    setupRoutes.call(this, urlList);

    // If nuxt don't have store - enable it
    if (!this.options.store) this.options.store = true;

    // Add all of the initial plugins
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

    // Sync all of the files and folders to relevant places in the nuxt build dir (.nuxt/)
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
