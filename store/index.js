import umbracoModule from './modules/Umbraco';

const namespace = <%= JSON.stringify(options.namespace) %>;
const umbracoData = <%= JSON.stringify(options[options.namespace]) %>;

export default ({store}, inject) => {
    store.registerModule(namespace, umbracoModule(umbracoData))
}
