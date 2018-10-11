let express = require('express'),
    router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

let eventsRouter = require('./api/events');

router.get('/', function(req, res) {
    res.send('Api home page');
});

router.use('/events', eventsRouter);

module.exports = router;