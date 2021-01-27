const {JSONPath} = require('jsonpath-plus');
const {getByPath, getByContentType} = require('./helper');

export default class JsonWorker {
    _namespace;
    _api;

    constructor({namespace, api, axios}) {
        this._namespace = namespace;
        this._api = api;
        this._axios = axios;
    }

    _getByPath(path) {
        return this._axios.post(`/${this._api.prefix}/${this._api.byPath}`, {
            path
        })
    }

    _getByContentType(contentType) {
        return this._axios.post(`/${this._api.prefix}/${this._api.byContentType}`, {
            contentType
        })
    }

    async getNodeData({store, $store}, {fetch, apiOnly}) {
        const st = store || $store

        let data;

        // console.log(st.getters['Umbraco/getSiteData']);
        // st.commit('Umbraco/set', {value: '132', path: 'inner.deeper.b'})

        switch (fetch.type) {
            case 'path':
                let storeResult = getByPath(st.getters['Umbraco/getUmbracoData'], {
                    path: fetch.pattern
                })

                if (!apiOnly && storeResult) {
                    data = storeResult
                } else {
                    data = await this._getByPath(fetch.pattern).then(res => res.data);
                }

                break;
            case 'contentType':
                let storeResultContent = getByContentType(st.getters['Umbraco/getUmbracoData'], {
                    contentType: fetch.pattern
                })

                if (!apiOnly && storeResultContent) {
                    data = storeResultContent
                } else {
                    data = await this._getByContentType(fetch.pattern).then(res => res.data);
                }

                break;
        }

        return data;
    }
}
