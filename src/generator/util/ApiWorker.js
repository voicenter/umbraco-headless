import axios from 'axios'

export default class ApiWorker {
  _baseUrl
  _site

  constructor(options) {
    this._baseUrl = options.generateUmbracoDataAPI
    this._site = options.site
  }

  _urlWithParams(urlPart) {
    return `${this._baseUrl}/${urlPart}?site=${this._site}`
  }

  _baseGetRequest(urlPart) {
    return axios({
      method: 'get',
      withCredentials: false,
      url: this._urlWithParams(urlPart)
    })
  }

  async getUrlList() {
    const {data} = await this._baseGetRequest('url-list')

    return data.data
  }

  async getJsonData() {
    const {data} = await this._baseGetRequest('json-data')

    return data.data
  }

  async getRobotsTxt() {
    const {data} = await this._baseGetRequest('robot-txt')

    return data.data
  }

  async getSitemapXML() {
    const {data} = await this._baseGetRequest('sitemap')

    return data.data
  }
}
