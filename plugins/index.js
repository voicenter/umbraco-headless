import * as helpers from './helpers/umbraco.js'

const options = JSON.parse(`<%= JSON.stringify(options) %>`);
const { namespace } = options;

export default ({ store, route }, inject) => {
    const { state } = store;

    inject(namespace, {
        LoadNuxtUmbracoData() {
            return helpers.LoadNuxtUmbracoData({ state, route, namespace })
        },
        log() {
            return helpers.log({ state, namespace })
        },
    })
}
