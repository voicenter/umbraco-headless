const {proceedInclude, proceedIgnore} = require('./objectWorker')

export default class JsonWorker {
    _namespace;
    _getUmbracoDataAPI;

    constructor({namespace, getUmbracoDataAPI, site, axios}) {
        this._namespace = namespace;
        this._getUmbracoDataAPI = getUmbracoDataAPI;
        this._site = site
        this._axios = axios;
    }

    _getFromAPI(fetch) {
        return this._axios({
            method: 'post',
            withCredentials: false,
            url: this._getUmbracoDataAPI,
            data: {
              ...fetch,
              site: this._site
            }
        })
    }

    async getNodeData({fetch, include, ignore}) {
        let {data} = await this._getFromAPI(fetch)

        if (Array.isArray(include) && include.length > 0) {
            data = proceedInclude(data, include)
        }

        if (Array.isArray(ignore) && ignore.length > 0) {
            proceedIgnore(data, ignore);
        }

        return data;
    }
}
