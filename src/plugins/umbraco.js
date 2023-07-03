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

    async getNodeData(fetchObject) {
        const {data} = await this._getFromAPI(fetchObject)

        return data;
    }
}
