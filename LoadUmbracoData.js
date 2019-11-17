const UmbracoLib = require('umbraco-headless');

const config = {
  user: 'sa',
  password: 'weLoveUmbraco',
  server: '192.168.1.1', // You can use 'localhost\\instance' to connect to named instance
  database: 'UmbracoNuxt',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};
// Load the UmbracoServer object

Umbraco = new UmbracoLib.UmbracoServerClass(config);




  (async function() {


    await  Umbraco.SaveUmbracoData()
    await  Umbraco.Dispose()


  })();

