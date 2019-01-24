const callDestination = require('sap-cf-destination');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Hello sitWDF 2019!'));

app.get('/sap', (req, res) => {
    callDestination({
        url: '/sap/bc/ping',
        connectivity_instance: 'connectivity-instance',
        uaa_instance: 'xsuaa-instance',
        destination_instance: 'destination-instance',
        destination_name: 'SAP',
        http_verb: 'GET'
    }).then(response => {
        res.type('json').send(response);
    }).catch( err => {
        console.error(err);
        res.status(500).send(err);
    });
});

app.get('/non-sap', (req, res) => {
    callDestination({
        url: '/job/haa-desktop/api/json/builds',
        connectivity_instance: 'connectivity-instance',
        uaa_instance: 'xsuaa-instance',
        destination_instance: 'destination-instance',
        destination_name: 'non-SAP',
        http_verb: 'GET'
    }).then(response => {
        res.type('json').send(response);
    }).catch( err => {
        console.error(err);
        res.status(500).send(err);
    });
});

app.listen(port, () => console.log(`sitWDF demo listening on port ${port}!`));

