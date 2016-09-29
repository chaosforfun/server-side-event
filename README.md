# server-side-event [![build status](https://travis-ci.org/chaosforfun/server-side-event.svg?branch=master)](https://travis-ci.org/chaosforfun/server-side-event)

node server side event

## install

    npm install server-side-event
    
## usage

    let http = require('http');
    let sse = require('server-side-event')(10000);// the retry time, default 15 second , unit ms
    let fs = require('fs');
    var client = fs.readFileSync('./client.html', 'utf-8');
    
    http.createServer(function (req, res) {
        let i = 0;
        if (req.url == '/sse') {
            sse(res);
            setInterval(function () {
                res.push({o: true, i: i});
                res.push('s ' + i);
                res.push('test' + i, 'test');
                res.push('message' + i++, 'message');
            }, 3000)
        } else {
            res.write(req.url);
            res.end();
        }
    }).listen('8808');

    //or with express
    var express = require('express');
    var app = express();
    let sse = require('server-side-event')(10000);// the retry time, default 15 second , unit ms
    
    app.get('/somePaht/', function(req, res) {
        sse(res);
        
        res.push({o: true, i: i});
        res.push('s ' + i);
        res.push('test' + i, 'test');
        res.push('message' + i++, 'message');
    })
    app.listen(8808)
