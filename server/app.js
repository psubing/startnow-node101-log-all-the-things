const express = require('express');
const fs = require('fs');
const app = express();
var isodate = new Date().toISOString();



app.use((req, res, next) => {
// write your logging code here
    console.log(req.headers['user-agent'].replace(',', '') + ',' + isodate + ',' + req.method + ',' + req.url + ',' + 'HTTP/' + req.httpVersion + ',' + res.statusCode) 
    fs.appendFile('log.csv', req.headers['user-agent'].replace(',', '') + ',' + isodate + ',' + req.method + ',' + req.url + ',' + 'HTTP/' + req.httpVersion + ',' + res.statusCode + '\n', (err) => {
        if (err) throw err;
        next();
    })});    

app.get('/', (req, res) => {
//write your code to respond "ok" here
    res.send('ok');
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
        fs.readFile("log.csv", 'utf8', (err, data) => {
            if (err) throw err;
    
            var values = [];
            var lines = data.split('\n');
    
            lines.forEach (function (lines) {
                var lineSplit = lines.split(',');
                var pushData = {
                    "Agent": lineSplit[0], 
                    "Time": lineSplit[1], 
                    "Method": lineSplit[2], 
                    "Resource": lineSplit[3], 
                    "Version": lineSplit[4], 
                    "Status": lineSplit[5]
                };
    
                values.push(pushData);
                
            });    
            
            res.json(values);
        })});


module.exports = app;