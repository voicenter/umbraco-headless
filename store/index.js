import umbracoModule from './modules/Umbraco';

const options = JSON.parse(`<%= JSON.stringify(options) %>`);
const {namespace} = options;

export default ({store}, inject) => {
    store.registerModule(namespace, umbracoModule(options, namespace))
}
