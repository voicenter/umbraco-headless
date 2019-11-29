const {JSONPath} = require('jsonpath-plus');

const storeModuleExists = (state, namespace) => {
    if (!state || !state[namespace]) {
        console.error(`${namespace} nuxt module error: store not initialized`);
        return false
    } else {
        return true
    }
};

// function to return the current value of the Umbraco object
export const LoadNuxtUmbracoData = ({ state, route, namespace }) => {
    if (!storeModuleExists(state, namespace)) return undefined;

    let Jpath = route.meta[0].Jpath;// When calling /abc the slug will be "abc"
    let NodeData = state[namespace].SiteData;
    let pathArray = Jpath.split('.');
    let finalData = {};
    let pathString = '';

    for (let i = 0; i < pathArray.length; i++) {
        pathString += i === 0 ? pathArray[i] : '.' + pathArray[i];

        if (pathArray[i] !== 'children') Object.assign(finalData, JSONPath(pathString, NodeData)[0]);
    }

    return finalData
};

// function to console log the current value of the Umbraco object
export const log = (state, namespace) => {
    if (!storeModuleExists(state, namespace)) return undefined;

    const Umbraco = state[namespace];

    return console.log(Umbraco)
};
