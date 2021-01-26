const {JSONPath} = require('jsonpath-plus');

export default class JsonWorker {
    _namespace;
    _api;

    constructor({namespace, api, axios}) {
        this._namespace = namespace;
        this._api = api;
        this._axios = axios;
    }

    _getByPath(path) {
        return this._axios.get(`/${this._api.prefix}/${this._api.byPath}?path=${path}`)
    }

    _getByContentType(contentType) {
        return this._axios.get(`/${this._api.prefix}/${this._api.byContentType}?contentType=${contentType}`)
    }

    async getNodeData({store, $store}, {fetch}) {
        const st = store || $store

        let data;

        // console.log(st.getters['Umbraco/getSiteData']);
        // st.commit('Umbraco/set', {value: '132', path: 'inner.deeper.b'})

        switch (fetch.type) {
            case 'path':
                data = await this._getByPath(fetch.pattern).then(res => res.data);

                break;
            case 'contentType':
                data = await this._getByContentType(fetch.pattern).then(res => res.data);

                break;
        }

        return data;
    }
}
