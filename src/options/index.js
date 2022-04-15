import merge from 'deepmerge';

export const defaults = {
    silent: false,
    trailingSlashRedirect: false,
    namespace: 'Umbraco',
    dataFilename: 'UmbracoData.json',
    prefetch: []
};

export default function initOptions(moduleOptions) {
    const nuxtOptionsToSync = ['rootDir', 'store'];

    const options = merge.all([
        defaults,
        this.options.umbracoHeadless || {},
        moduleOptions || {}
    ]);

    nuxtOptionsToSync.forEach(option => options[option] = this.options[option]);

    options.umbracoData = require(`${options.rootDir}/static/${options.dataFilename}`);

    return options;
}
