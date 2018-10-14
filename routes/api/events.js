let express = require('express'),
    event = express.Router(),
    fs = require('fs'),
    createError = require('http-errors'),
    bodyParser = require("body-parser"),
    obj = require('../../middleware/handleObject'),
    arr = require('../../middleware/handleArray');

event.use(bodyParser.urlencoded({extended: false}));
event.use(bodyParser.json());

/* GET event listing. */
event.get('/', (req, res, next) => {
    let reqPath = 'public/data/events.json';
    fs.readFile(reqPath, 'utf8', (err, data) => {
        let jsonObj = JSON.parse(data),
            jsonTypes = [];
        jsonObj.events.forEach((event) => {
            jsonTypes.push(event.type);
        });
        jsonTypes = arr.unique(jsonTypes);

        if (err) {
            res.end("Error: " + err)
        }

        else {

            if (req.query.type) {
                let events = obj.filter(jsonObj.events, req.query.type),
                    offset = parseInt(req.query.offset, 10),
                    limit = parseInt(req.query.limit, 10),
                    queryTypes = req.query.type.split(':');

                if (req.query.type === 'info' || req.query.type === 'critical') {
                    events = {events};
                    offset || limit ? res.json({'events' : obj.paginate(jsonObj.events, offset, limit)}) : res.json(events);
                }

                else if (req.query.type.match(/^(\w+:\w+)+$/)) {
                    arr.contains(jsonTypes, queryTypes) ? res.json(jsonObj) : next(createError(400));
                }

                else if (req.query.type !== undefined && req.query.type.match(/^\w+((&\w+=\w+)+)?$/)) {
                    next(createError(400));
                }
            }

            else {
                res.json(jsonObj);
            }
        }
    });
});

/* POST events handling */
event.post('/', (req, res, next) => {
    let reqPath = 'public/data/events.json';
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
