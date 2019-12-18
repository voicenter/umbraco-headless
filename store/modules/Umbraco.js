export default (umbracoData) => ({
    namespaced: true,
    state: () => ({
        ...umbracoData
    })
})
