let express = require('express'),
    event = express.Router(),
    fs = require('fs');

/* GET users listing. */
event.get('/', function(req, res) {
    let reqPath = 'data/events.json';
    console.log(req.query);
    fs.readFile(reqPath, 'utf8', (err, data) => {
       if (err) {res.end("Error: "+err )}
       else {
           let jsonObj = JSON.parse(data);
           res.json(jsonObj);
       }
    });
});

module.exports = event;