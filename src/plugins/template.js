import JsonWorker from './umbraco'

const namespace = <%= JSON.stringify(options.namespace) %>;
const getUmbracoDataAPI = <%= JSON.stringify(options.getUmbracoDataAPI) %>;

export default (ctx, inject) => {
    const jsonWorker = new JsonWorker({namespace, getUmbracoDataAPI, axios: ctx.$axios});

    inject(namespace, {
        get(context, fetchObject) {
            return jsonWorker.getNodeData(fetchObject);
        }
    })
}
