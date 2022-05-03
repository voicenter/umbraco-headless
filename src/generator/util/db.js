import sql from 'mssql'

import generateUrls from './generateUrls'
import sortNodes from './sortNodes'
import {JSONPath} from 'jsonpath-plus'

const PRODUCTION_MODE = 1

export default class DB_WORKER {
  connection
  options
  mode
  jsonData

  constructor(options) {
    this.options = options
  }

  async init() {
    this.connection = await sql.connect(`mssql://${this.options.dbUsername}:${this.options.dbPassword}@${this.options.dbHost}/${this.options.dbName}`)

    await this._setJsonData()

    const modeFromData = JSONPath(this.options.modePath, this.jsonData)

    if (modeFromData && modeFromData.length > 0) {
      this.mode = modeFromData[0]
    } else {
      this.mode = PRODUCTION_MODE
    }
  }

  async _query(q, key) {
    let result = await this.connection.query(q)
    result = result.recordset[0]
    result = result[key || Object.keys(result)[0]]

    try {
      result = JSON.parse(result);
    } catch (e) {
      // ...
    }

    return result;
  }

  async _exec(procedure, param, key) {
    const request = new sql.Request()
    request.input('NodeID', sql.Int, param)

    let result = await request.execute(procedure);
    result = result.recordset[0];
    result = result[key || Object.keys(result)[0]];

    try {
      result = JSON.parse(result);
    } catch (e) {
      // ...
    }

    return result;
  }

  getUrlList() {
    return this._query(`SELECT [dbo].[FN_GetUrlListByNode](${this.options.nodeID},  ${this.options.nodeID}) as Result;`)
  }

  getNode() {
    return this._query(`select * from FN_GetNodeFullData(${this.options.nodeID}, ${this.options.nodeID});`, 'JsonData')
  }

  getRobotTXT() {
    return this._query(`select dbo.FN_GetRobotTXT(${this.mode}, ${this.options.nodeID});`)
  }

  getSiteMAP() {
    return this._query(`select dbo.FN_GetSiteMAP(${this.mode}, ${this.options.nodeID});`)
  }

  async _setJsonData() {
    const data = await this.getUrlList()
    data.SiteData = sortNodes(await this.getNode())

    generateUrls(data)

    this.jsonData = data
  }

  getJsonData() {
    return this.jsonData
  }
}
