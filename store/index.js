const {resolve, join} = require('path');

export default function setupStore(moduleOptions) {
    if (!this.options.store) this.options.store = true;

    moduleOptions.storeData = {
        SiteData: {},
        GlobalData: {}
    }

    this.addPlugin({
        src: resolve(__dirname, 'template.js'),
        fileName: join(moduleOptions.namespace, 'store/template.js'),
        options: moduleOptions
    })

    this.addTemplate({
        src: resolve(__dirname, 'store.js'),
        fileName: join(moduleOptions.namespace, 'store/store.js'),
        options: moduleOptions
    })
}
