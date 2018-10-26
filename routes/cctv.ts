import {Response, Request, Router} from "express";

let router = Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response) {
    res.render('cctv', {title: 'Наблюдение'});
});

module.exports = router;