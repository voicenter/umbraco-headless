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

  async _baseGetRequest(urlPart) {
    let result = ''

    try {
      result = await axios({
        method: 'get',
        withCredentials: false,
        url: this._urlWithParams(urlPart)
      })
    } catch (e) {
      console.log(`Failed to make request to ${this._urlWithParams(urlPart)}`, e)
    }

    return result
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
