const fs = require('fs')
const sql = require('mssql')
const app ={}
module.exports =  app




app.UmbracoServerClass= class UmbracoServerClass {
    constructor(config) {
        if(!config&& config.constructor.name==="Object") throw new Error('dbCon is Required to the UmbracoServerClass to run ... ');
        this.config = config;
        this.connected=false
        //this.connect()
    }
    async connect () {
        this.connected=true
        this.pool = await sql.connect(this.config)
        console.log("Sql Is Concted ?",this.pool)


    }
    async Dispose () {
        this.connected=false
        this.pool.close()
        console.log("Sql Is Colose",this.pool)


    }
    async GetNode (NodeID) {
        let result1 = await this.pool.request().input('NodeID', sql.Int, NodeID)
            .query('select * from FN_GetNodeFullData(@NodeID)')
        return JSON.parse( result1.recordsets[0][0].JsonData)

    }
    async GetUrlList () {
        if(!this.connected)await this.connect()
        let result1 = await this.pool.request().query('SELECT [dbo].[FN_GetUrlList]() as JsonData')
        return JSON.parse( result1.recordsets[0][0].JsonData)

    }
    async SaveUmbracoData(fileName){
        if(!fileName)fileName='./static/UmbracoData.json'
        let UrlList = await  this.GetUrlList()
        UrlList.SiteData = await  this.GetNode(1095)

        //console.log("__dirname",__dirname)


        await fs.writeFileSync(fileName, JSON.stringify(UrlList));
    }
}
