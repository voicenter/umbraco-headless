export default ({GlobalData = []}) => ({
    namespaced: true,
    state: () => ({
        GlobalData
    }),
    getters: {
        getGlobalData(store) {
            return store.GlobalData
        },
        getGlobalDataByKey: (store) => (key) => {
            return store.GlobalData[key]
        }
    }
})
