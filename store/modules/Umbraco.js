export default (options, namespace) => ({
    namespaced: true,
    state: () => ({
        ...options[namespace]
    })
})
