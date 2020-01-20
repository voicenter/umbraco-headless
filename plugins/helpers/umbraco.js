const {JSONPath} = require('jsonpath-plus');

const storeModuleExists = (state, namespace) => {
    if (!state || !state[namespace]) {
        console.error(`${namespace} nuxt module error: store not initialized`);
        return false
    } else {
        return true
    }
};

/**
 * Function to return the current value of the Umbraco object relative to the current path
 * and merge it with the values moving to the most parent path
 *
 * @param state
 * @param route
 * @param namespace
 * @returns {object}
 * @constructor
 */
export const LoadNuxtUmbracoData = ({ state, route, namespace }) => {
    if (!storeModuleExists(state, namespace)) return undefined;

    let Jpath = route.meta[0].Jpath;// When calling /abc the slug will be "abc"
    let NodeData = state[namespace].SiteData;
    let pathArray = Jpath.split('.');
    let finalData = {};
    let pathString = '';
    let tempPathString = '';
    let urlList = state[namespace].urlList;

    for (let i = 0; i < pathArray.length; i++) {
        pathString += i === 0 ? pathArray[i] : '.' + pathArray[i];

        if (pathArray[i] !== 'children') {
            let objData = JSONPath(pathString, NodeData)[0]

            // check if we have children in object
            // and if child has url in urlList -> fill childrenUrls with [child key]:child url
            if(objData.children && !(Object.entries(objData.children).length === 0 && objData.children.constructor === Object)) {
                for(let [key, value] of Object.entries(objData.children)) {
                    tempPathString = pathString + '.children.' + key;

                    for(let j = 0; j < urlList.length; j++) {
                        if(tempPathString === urlList[j].Jpath) {
                            objData.children[key].url = urlList[j].url
                            break;
                        }
                    }
                    tempPathString = '';
                }
            }

            Object.assign(finalData, objData);
        }
    }

    return finalData
};

// function to console log the current value of the Umbraco object
export const log = (state, namespace) => {
    if (!storeModuleExists(state, namespace)) return undefined;

    const Umbraco = state[namespace];

    return console.log(Umbraco)
};
