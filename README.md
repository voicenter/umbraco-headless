"# umbraco-headless" 
const UmbracoLib = require('./index.js');
const config = {
    user: 'sa',
    password: 'ILoveUmbraco',
    server: '192.168.201.120', // You can use 'localhost\\instance' to connect to named instance
    database: 'UmbracoNuxt',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};
// Load the UmbracoServer object 
const Umbraco = new UmbracoLib.UmbracoServerClass(config);
// Require a web  framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/Api/GetNode/', async (request, reply) => {
    let resualt = await  Umbraco.GetNode(1095)
    return resualt
})
// Run the server!
const startWebService = async () => {
    try {
        await fastify.listen(3001)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
async function  Connect(){
    await Umbraco.connect();
    this.mainNode =await  Umbraco.GetNode(1095)
    await startWebService()
}

Connect();