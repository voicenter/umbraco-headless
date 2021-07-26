import umbracoModule from './store';

const namespace = <%= JSON.stringify(options.namespace) %>;
const storeData = <%= JSON.stringify(options.storeData) %>;

export default ({store}, inject) => {
    store.registerModule(namespace, umbracoModule(storeData))
}
