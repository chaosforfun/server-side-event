/**
 * Created by zhaosc on 9/1/16.
 */
/**
 * init SSE
 * @param {Number} retry - retry time default 15000 ms
 * @return {Function}
 * */
module.exports = function InitSSE({retry}) {
    retry = retry || 15000;

    /**
     * add push function to res
     * @param {Response} res - express res or standard http response
     * */
    return function sse(res) {
        res.socket.setKeepAlive(true);
        res.socket.setTimeout(0);
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.statusCode = 200;

        // export push to send server-side-events
        res.push = function push(data, event, id) {
            if (typeof data == 'object') {
                data = JSON.stringify(data);
            }
            if (event) {
                saveWrite(res, 'event: ' + event + '\n');
            }
            if (id !== undefined) {
                saveWrite(res, 'id: ' + id + '\n');
            }
            saveWrite(res, 'data: ' + data + '\n\n');
        };

        // write 2kB of padding (for IE) and a reconnection timeout
        // then use res.sse to send to the client

        // res.write(':' + Array(2049).join(' ') + '\n');
        res.write('retry: ' + retry + '\n\n');

        // keep the connection open by sending a comment
        var keepAlive = setInterval(function () {
            if (res.finished) {
                clearInterval(keepAlive);
                return
            }
            res.write(':keep-alive\n');
        }, 20000);

        // cleanup on close
        res.on('close', function close() {
            clearInterval(keepAlive);
        });
    };
};

function saveWrite(res, str) {
    if(res.finished) {
        return false;
    }
    res.write(str);
}