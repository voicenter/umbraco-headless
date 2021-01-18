const bodyParser = require('body-parser');
const app = require('express')();
const cors = require('cors');

app.use(bodyParser.json())
app.use(cors())

function setupApi(data) {
    const {siteData, urlList} = data

    app.get('/rootData/', (req, res) => {
        let data = JSON.parse(JSON.stringify(siteData));
        const getChildren = req.query.getChildren || false;

        if (!getChildren) {
            delete data.children
        }

        res.json({data: data})
    })

    return app
}

exports.setupApi = setupApi;
