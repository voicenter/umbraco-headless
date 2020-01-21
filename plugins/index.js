import * as helpers from './helpers/umbraco.js'

const namespace = <%= JSON.stringify(options.namespace) %>;

export default ({ store, route }, inject) => {
    const { state } = store;

    inject(namespace, {
        LoadNuxtUmbracoData({ route }) {
            return helpers.LoadNuxtUmbracoData({ state, route, namespace })
        },
        LoadRootData() {
            return helpers.LoadRootData({ state, namespace })
        },
        log() {
            return helpers.log({ state, namespace })
        },
    })
}
