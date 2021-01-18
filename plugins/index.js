import JsonWorker from './helpers/umbraco.js'

const namespace = <%= JSON.stringify(options.namespace) %>;

export default ({ store, route }, inject) => {
    const { state } = store;
    const jsonWorker = new JsonWorker(state, namespace);

    inject(namespace, {
        getNodeData({route}) {
            return jsonWorker.getNodeData(route);
        }
    })
}
