const bodyParser = require('body-parser');
const app = require('express')();
const cors = require('cors');
const {getByPath, getByContentType} = require('./helper');

app.use(bodyParser.json())
app.use(cors())

function api({umbracoData, api}) {
    app.post(`/${api.byPath}`, ({body}, res) => {
        const data = getByPath(umbracoData, body)

        res.json(data)
    })

    app.post(`/${api.byContentType}`, ({body}, res) => {
        const data = getByContentType(umbracoData, body)

        res.json(data)
    })

    return app
}

export default function setupApi(options) {
    this.addServerMiddleware({ path: `/${options.api.prefix}`, handler: api(options) });
}
