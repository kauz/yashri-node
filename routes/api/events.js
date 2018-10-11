let express = require('express'),
    event = express.Router(),
    fs = require('fs'),
    createError = require('http-errors'),
    filter = require('../../middleware/filterObject');

/* GET users listing. */
event.get('/', (req, res, next) => {
    let reqPath = 'data/events.json';
    fs.readFile(reqPath, 'utf8', (err, data) => {
        let jsonObj = JSON.parse(data);
        if (err) {
            res.end("Error: " + err)
        }
        else {
            if (req.query.type === 'info' || req.query.type === 'critical') {
                let events = filter(jsonObj.events, req.query.type);
                events = {events};
                res.json(events);
            } else if (req.query.type !== undefined && req.query.type.match(/^\w+$/)) {
                next(createError(400));
            }
            else {
                res.json(jsonObj);
            }
        }
    });
});


event.post('/', (req, res) => {
    res.send('Konichiwa!');
});

module.exports = event;