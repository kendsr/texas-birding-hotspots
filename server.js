require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {HotSpot} = require('./models/hotspot');
const {County} = require('./models/county');
const port = process.env.PORT;
const title = "Texas Birding Hotspots";

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.redirect('/hotspots');
});

app.get('/hotspots/about', (req, res) => {
    res.render("about", {title:title});
});

app.get('/hotspots', (req, res) =>{
    // return array of distinct hotspot counties
    HotSpot.distinct("location").then((counties) => {
        if (!counties) {
            return res.status(404).send();           
        }
        counties.sort();
        // Remove hotspots that don't have location
        if (counties[0] === "") {
            counties.splice(0,1);
        }
        res.render("index", {title:title, counties:counties});
    }).catch((e) => res.status(400).send(e));
});

app.get('/hotspots/:county', (req, res) => {
   
    // return array of hotspots for a given county
    var county = req.params.county;
    
    HotSpot.find({"location": county}).then((hotspots) => {
        if (!hotspots) {
            return res.status(404).send();
        }     
        var data = JSON.stringify(hotspots);
        res.render("county", {title:title,countyName:county, data: data});
    }).catch((e) => res.status(400).send());
});

app.get('/hotspots/:county/recent', (req, res) => {
    // Return top 60 observations in county
    var regionCode = "";
    var county = req.params.county;
    // Trim "County" from county name to facilitate region code lookup
    var check = county.slice(county.lastIndexOf(" ")+1, county.length);
    if (check == "County"){
        var lookup = county.slice(0, county.lastIndexOf(" "));
    } else {
        lookup = county;
    }
    // get County region code from counties collection
    County.find({"name": lookup}).then ((countycode) => {
        if (!countycode) {
            regionCode = "None";
        } else {
            regionCode = countycode[0].code;
        }
       
        var http = require("https");
        var options = {
            "method": "GET",
            "hostname": "ebird.org",
            "path": "/ws2.0/data/obs/" + regionCode + "/recent?maxResults=60",
            "headers": {"X-eBirdApiToken": "r1cbnelmoh36"}
        };

        var req = http.request(options, function (resp) {
            var chunks = [];

            resp.on("data", function (chunk) {
                chunks.push(chunk);
            });

            resp.on("end", function () {
                var body = Buffer.concat(chunks);
                var obj = JSON.parse(body);
                res.render('observations', {title:title, county:county, topTen:obj});
            });
        });
        req.end();
    }); // End County.find,then 
});

app.get('/others', (req, res) =>{
    // return array of hotspots without location
    HotSpot.distinct("hotspot", {"location": { $eq: "" } }).then((hotspots) => {
        if (hotspots.length === 0) {
          var message = "All Sites have counties";
        }
        hotspots.sort();
        res.render("indexOthers", {title:title, hotspots:hotspots, message:message});
        }).catch((e) => res.status(400).send());
});

app.get('/others/:hotspot', (req, res) =>{
    // return map of hotspot w/o location
    var hotspot = req.params.hotspot;
    HotSpot.find({"hotspot": hotspot} ).then((hotspots) => {
        if (!hotspots) {
            return res.status(404).send();
        }
        var data = JSON.stringify(hotspots);
        res.render("other", {title:title, countyName:hotspot, data: data});
        }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
    console.log('Server started on port', port);
});
