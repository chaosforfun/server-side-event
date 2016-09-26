/**
 * Created by zhaosc on 9/2/16.
 */
let http = require('http');
let fs = require('fs');

let sse = require('../index.js')(10000);// the retry time, default 15 second , unit ms
var client = fs.readFileSync(__dirname + '/client.html', 'utf-8');

http.createServer(function (req, res) {
    console.log(req.url);
    let i = 0;
    if(req.url == '/') {
        res.write(client);
        return res.end();
    }
    if (req.url == '/sse') {
        sse(res);
        setInterval(function () {
            res.push({o: true, i: i});
            res.push('s ' + i);
            res.push('test' + i++, 'test')
            res.push('message' + i++, 'message')
        }, 3000)
    } else {
        res.write(req.url);
        res.end();
    }
}).listen('8808');

console.log('please open localhost:8808 and chrome dev tool');