const {resolve, join} = require('path');
const {getByPath, getByContentType} = require('../api/helper');
const helper = require('./helper');
const set = require('set-value');

export default function setupStore(moduleOptions) {
    if (!this.options.store) this.options.store = true;

    const storeData = {
        SiteData: {},
        GlobalData: {}
    }

    if (moduleOptions.prefetch && moduleOptions.prefetch.length > 0) {
        moduleOptions.prefetch.forEach(loadObject => {
            if (!helper.validateLoadObject(loadObject)) return;

            function setToStore(data) {
                helper.proceedIgnore(data, loadObject.ignore);

                if (loadObject.format) {
                    data = loadObject.format(data)
                }

                if (loadObject.globalKey) {
                    storeData.GlobalData[loadObject.globalKey] = data;
                } else {
                    let path = data.jpath;
                    path = path.replace('$', 'SiteData')

                    set(storeData, path, data);
                }
            }

            if (loadObject.fetch.type === 'path') {
                let result = getByPath(moduleOptions.umbracoData, {path: loadObject.fetch.pattern});

                setToStore(result);
            } else if (loadObject.fetch.type === 'contentType') {
                let resultList = getByContentType(moduleOptions.umbracoData, {contentType: loadObject.fetch.pattern});

                resultList.forEach(resultEl => setToStore(resultEl))
            }
        })
    }

    moduleOptions.storeData = storeData;

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
