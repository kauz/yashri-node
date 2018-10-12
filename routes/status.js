let express = require('express'),
    router = express.Router(),
    msThHms = require('../middleware/msToHms');

let version = process.version;
let platform = process.platform;

/* GET status page. */
router.get('/', function (req, res) {
    let uptime = msThHms(process.uptime());
    let memory = process.memoryUsage();
    res.render('status', {title: 'Status', platform, uptime, memory, version});
});

module.exports = router;