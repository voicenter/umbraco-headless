const bodyParser = require('body-parser');
const app = require('express')();
const cors = require('cors');
const {extendWithUrls} = require('./helper/util');

app.use(bodyParser.json())
app.use(cors())

function setupApi(data) {
    const {SiteData, urlList} = data

    app.get('/rootData/', (req, res) => {
        let data = JSON.parse(JSON.stringify(SiteData));
        const getChildren = req.query.getChildren || false;

        if (!getChildren) {
            delete data.children
        }

        res.json({data: data})
    })

    app.get('/byPath', (req, res) => {
        const rootData = JSON.parse(JSON.stringify(SiteData));
        const getChildren = req.query.getChildren || false;
        const path = req.query.path;

        let data = extendWithUrls({siteData: rootData, urlList}, path);

        if (!getChildren) {
            delete data.children
        }

        res.json({data: data})
    })

    app.get('/byContentType', (req, res) => {
        const rootData = JSON.parse(JSON.stringify(SiteData));
        const contentType = req.query.contentType;
        const getChildren = req.query.getChildren || false;
        const data = []

        Object.values(rootData.children).forEach(item => {
            if (item.ContentType === contentType) {
                if (!getChildren) {
                    delete item.children
                }

                data.push(item)
            }
        })

        res.json({data: data})
    })

    return app
}

exports.setupApi = setupApi;
