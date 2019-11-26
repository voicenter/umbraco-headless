"# umbraco-headless" 
This Project have three part which needed to do full integration between Umbraco and Nuxt .
1.  MsSql (2016+) T-SQL Json  Functions that give us the Umbraco  Object as very nice json objects
2.  Node.Js server side Library that work in-front of MsSql server to receive Umbraco Data
3. Nuxt Plugin  in that Push the $LoadNuxtUmbracoData that give you the ability to load the data from the Vuex into the page  
      
       async asyncData (context) {
          return context.app.$LoadNuxtUmbracoData(context)
        }

  
Webserver implantation example : 


    
    const UmbracoLib = require('umbraco-headless');
    const config = {
        user: 'sa',
        password: 'weLoveUmbraco',       
        
        server: '192.168.1.1', // You can use 'localhost\\instance' to connect to named instance
        database: 'UmbracoNuxt',
        options: {
            encrypt: true // Use this if you're on Windows Azure
            }};
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



To install in Nuxt Project Need to do the following steps :

1.copy node_modules\umbraco-headless\LoadUmbracoData.js .
2.notepad\nano\vi  LoadUmbracoData.js (change Mssql password)
3.Load Routes in Nuxt nuxt.config.js :

       const UmbracoData = require("./static/UmbracoData.json")
        ...
        
       router: {
          extendRoutes (routes, resolve) {
           UmbracoData.urlList.forEach(function (url) {
             const route = {
               name: url.nodeID,
               path: url.url,
               component: resolve(__dirname, 'pages/' + url.TemplateAlias + '.vue'),
               meta: url
             }
     
             const duplicateIndex = routes.findIndex(function (route) {
               return route.name === url.TemplateAlias
             })
     
             if (duplicateIndex !== -1) { routes.splice(duplicateIndex, 1) }
     
             routes.push(route)
           })
        }
      },
      ....
  
 4.Create plugins/NuxtUmbraco.js

     const UmbracoNuxt = require('umbraco-headless/UmbracoNuxt');
     export default UmbracoNuxt ;
 
    
5.Add  nuxt.config.js :

     plugins: [
        '~/plugins/NuxtUmbraco.js'
      ],

6 . Add store/Umbraco.js
    
    import data from "~/static/UmbracoData.json"
    export const state = () => (data)

7.  add the asyncData in each Template in the pages folder  Make sure you have all necessary pages :
  
        
         async asyncData (context) {
            return context.app.$LoadNuxtUmbracoData(context)
          }


7 . Buy Shlomi Beer 
