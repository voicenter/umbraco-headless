const {resolve, join} = require('path');

export default function setupPlugin(moduleOptions) {
    this.addPlugin({
        src: resolve(__dirname, 'template.js'),
        fileName: join(moduleOptions.namespace, 'plugin/template.js'),
        options: moduleOptions
    })

    this.addTemplate({
        src: resolve(__dirname, 'template.js'),
        fileName: join(moduleOptions.namespace, 'plugin/template.js'),
        options: moduleOptions
    })

    this.addTemplate({
        src: resolve(__dirname + '/../api/', 'helper.js'),
        fileName: join(moduleOptions.namespace, 'plugin/helper.js'),
        options: moduleOptions
    })

    this.addTemplate({
        src: resolve(__dirname, 'umbraco.js'),
        fileName: join(moduleOptions.namespace, 'plugin/umbraco.js'),
        options: moduleOptions
    })
}
