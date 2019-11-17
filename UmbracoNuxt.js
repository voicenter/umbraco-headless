const {JSONPath} = require('jsonpath-plus');

module.exports = function ({ app }, inject) {
  inject('LoadNuxtUmbracoData', (context )=> {
    let Jpath = context.route.meta[0].Jpath// When calling /abc the slug will be "abc"
    let NodeData = context.store.state.Umbraco.SiteData
    //console.log('That was easy! Jpath,SiteData are here for us ...', Jpath,NodeData)
    let  result = JSONPath( Jpath, NodeData)[0]
    console.log(result)
    return result
  })
}
