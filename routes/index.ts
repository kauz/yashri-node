import {Response, Request, Router} from "express";

let fs = require('fs'),
    router = Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response) {
    let reqPath: string = 'public/data/events.json';
    fs.readFile(reqPath, 'utf8', (err: object, data: string) => {
        let events: object = JSON.parse(data);
        if (err) {
            res.end("Error: " + err)
        }
        else {
            res.render('index', {title: 'Лента событий', data: events});
        }
    });
});

module.exports = router;
