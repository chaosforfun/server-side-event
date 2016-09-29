/**
 * Created by zhaosc on 9/2/16.
 */
let http = require('http');
let fs = require('fs');

let sse = require('../index.js')(10000);// the retry time, default 15 second , unit ms
let client = fs.readFileSync(__dirname + '/client.html', 'utf-8');
let browser = 0;
http.createServer(function (req, res) {
    console.log(req.url);
    let i = 0;
    if (req.url == '/') {
        browser++;
        res.write(client);
        return res.end();
    }
    if (req.url == '/sse') {
        sse(res);
        setInterval(function () {
            res.push({o: true, i: i});
            res.push('s ' + i);
            res.push('test' + i, 'test')
            res.push('message' + i++, 'message')
        }, 3000)
    } else {
        res.write(req.url);
        res.end();
    }
    res.on('close', ()=> {
        browser--;
        if(browser < 0) {
            process.exit();
        }
    })
}).listen('8808');

console.log('please open localhost:8808 and chrome dev tool');

let expects = [
    'retry: 10000\n\n',
    'data: {"o":true,"i":0}\n\n',
    'data: s 0\n\n',
    'event: test\n',
    'data: test0\n\n',
    'event: message\n',
    'data: message0\n\n'
];
let req = http.request('http://localhost:8808/sse', res=> {
    res.setEncoding('utf-8');
    res.on('data', data=> {
        let expect = expects.shift();
        if (!expect) {
            res.destroy();
            return;
        }
        if (expect !== data) {
            throw expect + '---' + data
        }
    })
});
req.end();