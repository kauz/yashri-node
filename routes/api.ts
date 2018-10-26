import {Response, Request, Router, NextFunction} from "express";

let router = Router();


// middleware that is specific to this router
router.use(function timeLog(req: Request, res: Response, next: NextFunction) {
    console.log('Time: ', Date.now());
    next();
});

let eventsRouter: Router = require('./api/events');

router.get('/', function (req: Request, res: Response) {
    res.send('Api home page');
});

router.use('/events', eventsRouter);

module.exports = router;
