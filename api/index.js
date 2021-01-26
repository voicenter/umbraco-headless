const bodyParser = require('body-parser');
const app = require('express')();
const cors = require('cors');
const {getByPath, getByContentType} = require('./helper');

app.use(bodyParser.json())
app.use(cors())

function api({umbracoData, api}) {
    app.get(`/${api.byPath}`, (req, res) => {
        const data = getByPath(umbracoData, req.query)

        res.json(data)
    })

    app.get(`/${api.byContentType}`, (req, res) => {
        const data = getByContentType(umbracoData, req.query)

        res.json(data)
    })

    return app
}

export default function setupApi(options) {
    this.addServerMiddleware({ path: `/${options.api.prefix}`, handler: api(options) });
}
