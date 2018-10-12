let express = require('express'),
    fs = require('fs'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    let reqPath = 'public/data/events.json';
    fs.readFile(reqPath, 'utf8', (err, data) => {
        let events = JSON.parse(data);
        if (err) {
            res.end("Error: " + err)
        }
        else {
                res.render('index', { title: 'Лента событий', data: events });
        }
    });
});

module.exports = router;