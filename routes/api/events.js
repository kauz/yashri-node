let express = require('express'),
    event = express.Router(),
    fs = require('fs'),
    createError = require('http-errors'),
    bodyParser = require("body-parser"),
    filter = require('../../middleware/filterObject');

event.use(bodyParser.urlencoded({ extended: false }));
event.use(bodyParser.json());

/* GET event listing. */
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

/* POST events handling */
event.post('/', (req, res, next) => {
    let reqPath = 'data/events.json';
    fs.readFile(reqPath, 'utf8', (err, data) => {
        let jsonObj = JSON.parse(data);
        if (err) {
            res.end("Error: " + err)
        } else {
            if (req.body) {
                if (req.body.type === 'info' || req.body.type === 'critical') {
                    let events = filter(jsonObj.events, req.body.type);
                    events = {events};
                    res.json(events);
                } else if (req.body.type !== undefined && req.body.type.match(/^\w+$/)) {
                    next(createError(400));
                } else {
                    res.send('Konichiwa!');
                }
            }
        }
    });

});

module.exports = event;