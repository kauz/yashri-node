let express = require('express'),
    router = express.Router();

let now = new Date();
let version = process.version;
let platform = process.platform;

function convertToString(ms, delim = " : ") {
    const showWith0 = value => (value < 10 ? `0${value}` : value);
    const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 60));
    const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
    const seconds = showWith0(Math.floor((ms / 1000) % 60));
    return `${parseInt(hours) ? `${hours}${delim}` : ""}${minutes}${delim}${seconds}`;
}

/* GET status page. */
router.get('/', function (req, res, next) {
    let uptime = process.uptime();
    let memory = process.memoryUsage();
    res.render('status', {title: 'Status', platform, uptime, memory, version});
});

module.exports = router;