import set from 'set-value';

export default ({SiteData = {}, GlobalData = []}) => ({
    namespaced: true,
    state: () => ({
        SiteData,
        GlobalData
    }),
    mutations: {
        set(store, {path, value}) {
            set(store.SiteData, path, value);
        }
    },
    getters: {
        getUmbracoData(store) {
            return store
        },
        getSiteData(store) {
            return store.SiteData;
        },
        getGlobalData(store) {
            return store.GlobalData
        }
    }
})
