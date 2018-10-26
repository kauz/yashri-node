import {Response, Request, Router} from "express";

let router = Router(),
    msThHms = require('../middleware/msToHms');

let version: String = process.version;
let platform: String = process.platform;

/* GET status page. */
router.get('/', function (req: Request, res: Response) {
    let uptime: String = msThHms(process.uptime());
    let memory: Object = process.memoryUsage();
    res.render('status', {title: 'Status', platform, uptime, memory, version});
});

module.exports = router;