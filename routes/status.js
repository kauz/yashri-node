let express = require('express'),
    router = express.Router();

/* GET status page. */
router.get('/', function(req, res, next) {
    let uptime = process.uptime();
    let memory = process.memoryUsage();
    let version = process.version;
    console.log(process.cpuUsage());
    console.log(process.platform);
    res.render('status', { title: 'Status', uptime, memory, version});
});

module.exports = router;