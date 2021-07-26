import JsonWorker from './umbraco'

const namespace = <%= JSON.stringify(options.namespace) %>;
const api = <%= JSON.stringify(options.api) %>;

export default (ctx, inject) => {
    const jsonWorker = new JsonWorker({namespace, api, axios: ctx.$axios});

    inject(namespace, {
        get(context, fetchObject) {
            return jsonWorker.getNodeData(context, fetchObject);
        }
    })
}
