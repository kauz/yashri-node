import {Response, Request, Router, NextFunction} from "express";
import {events} from '../../middleware/handleEvents';

let event = Router(),
    fs = require('fs'),
    createError = require('http-errors'),
    bodyParser = require("body-parser"),
    obj = require('../../middleware/handleEvents');

event.use(bodyParser.urlencoded({extended: false}));
event.use(bodyParser.json());

event.get('/', (req: Request, res: Response, next: NextFunction) => {
    let reqPath: string = 'public/data/events.json';

    fs.readFile(reqPath, 'utf8', (err: object, data: string) => {
        let jsonObj: events = JSON.parse(data);

        if (err) {
            res.end("Error: " + err)
        }

        else {
            if (req.query.type) {
                let events: object = obj.filterObj(jsonObj.events, req.query.type),
                    offset: number = parseInt(req.query.offset, 10),
                    limit: number = parseInt(req.query.limit, 10);

                if (req.query.type === 'info' || req.query.type === 'critical') {
                    events = {events};
                    offset || limit ? res.json({'events': obj.paginate(jsonObj.events, offset, limit)}) : res.json(events);
                }

                else {
                    next(createError(400));
                }

            }

            else {
                res.json(jsonObj);
            }
        }
    });

});

module.exports = event;