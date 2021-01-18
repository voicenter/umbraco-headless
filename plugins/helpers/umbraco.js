const {JSONPath} = require('jsonpath-plus');

const getNodeDataFromFullDataAPI = (path) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const nodeData = fullData[path];

            if (nodeData !== undefined && typeof nodeData === 'object') {
                resolve(nodeData)
            } else {
                reject(new Error(`Cannot find data by "${path}" path`));
            }
        }, 2000)
    })
}

class JsonWorker {
    _state;
    _namespace;
    _storeSiteData;
    _toIgnore;

    constructor(state, namespace, toIgnore = []) {
        this._state = state;
        this._namespace = namespace;
        this._toIgnore = toIgnore;
        this._storeSiteData = this._state[this._namespace].SiteData;
    }

    _setPropertiesIfNotExists(obj, path, lastKeyValue = null) {
        const pathArray = path.split('.');

        const setIfNotExists = (pathPartIndex) => {
            const currentKey = pathArray[pathPartIndex];

            // Check if we already have current property in the object
            if (!obj[currentKey]) {
                // If not - set it

                if (pathArray[pathPartIndex + 1]) {
                    // Set an object as a value only in case we have more inner structure
                    obj[currentKey] = {}
                } else {
                    // If not - set last key value
                    obj[currentKey] = lastKeyValue
                }
            } else if (pathArray[pathPartIndex + 1]) {
                // If yes and we have inner structure - move next

                pathPartIndex++;

                setIfNotExists(pathPartIndex)
            }
        }

        setIfNotExists(0)
    }

    _setStoreSiteData(key, value) {
        this._storeSiteData[key] = value;
    }

    _nodeExistsInStore(path) {
        return !!this._getNodeFromStore(path).length
    }

    _getNodeFromStore(path) {
        return JSONPath(path, this._storeSiteData);
    }

    async _fillDataRecursively(path) {
        const pathArray = path.split('.');

        const fillNode = async (pathPartIndex) => {
            const pathPart = pathArray[pathPartIndex];

            if (!this._nodeExistsInStore(pathPart)) {
                console.log('not exists', pathPart)

                try {
                    await this.setNodeDataFromApi(pathPart)
                } catch (e) {
                    console.log(e)
                }
            }

            pathPartIndex++;

            if (pathPartIndex < pathArray.length) {
                await fillNode(pathPartIndex)
            }
        }

        await fillNode(0)
    }

    async getNodeData(path) {
        if (this._nodeExistsInStore(path)) {
            return this._getNodeFromStore(path);
        } else {
            await this._fillDataRecursively(path);

            return this._getNodeFromStore(path);
        }
    }

    async setNodeDataFromApi(path) {
        const nodeData = await getNodeDataFromFullDataAPI(path)

        this._setStoreSiteData(path, nodeData)
    }
}
