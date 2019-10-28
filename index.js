const sql = require('mssql')
const app ={}
module.exports =  app




app.UmbracoServerClass= class UmbracoServerClass {
     constructor(config) {
        if(!config&& config.constructor.name==="Object") throw new Error('dbCon is Required to the UmbracoServerClass to run ... ');
        this.config = config;

    }
    async connect () {
         this.pool = await sql.connect(this.config)

    }
    async GetNode (NodeID) {
        let result1 = await this.pool.request().input('NodeID', sql.Int, NodeID)
            .query('select * from FN_GetNodeFullData(@NodeID)')
         return JSON.parse( result1.recordsets[0][0].JsonData)

    }
}
