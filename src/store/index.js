const {resolve, join} = require('path');
const helper = require('../helper/objectWorker');
const {getByPath, getByContentType} = require('../helper/helper')

export default function setupStore(moduleOptions) {
  if (!this.options.store) this.options.store = true;

  const storeData = {
    GlobalData: {}
  }

  if (moduleOptions.prefetch && moduleOptions.prefetch.length > 0) {
    moduleOptions.prefetch.forEach(loadObject => {
      if (!helper.validateLoadObject(loadObject)) return;

      function setToStore(data) {
        if (Array.isArray(loadObject.include) && loadObject.include.length > 0) {
          data = helper.proceedInclude(data, loadObject.include)
        }

        if (Array.isArray(loadObject.ignore) && loadObject.ignore.length > 0) {
          helper.proceedIgnore(data, loadObject.ignore);
        }

        if (loadObject.format) {
          data = loadObject.format(data)
        }

        storeData.GlobalData[loadObject.globalKey] = data;
      }

      if (loadObject.fetch.type === 'path') {
        let result = getByPath(moduleOptions.umbracoData, loadObject.fetch.pattern);

        setToStore(result);
      } else if (loadObject.fetch.type === 'contentType') {
        let resultList = getByContentType(moduleOptions.umbracoData, loadObject.fetch.pattern);

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
