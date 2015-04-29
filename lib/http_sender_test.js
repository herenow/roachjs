var Sender = require('./http_sender.js')
var assert = require('assert')
var proto  = require('./proto.js')
var EventEmmiter = require('events').EventEmitter

var http_mock =  function() {
    return {
        request: function(opts, callback) {
            var res = new EventEmmiter()
            res.statusCode = 200
            res.setEncoding = function() {}

            callback(res)

            process.nextTick(function() {
                res.emit('data', '')
                res.emit('end')
            })
            return {
                on: function() {},
                write: function() {},
                end: function() {},
            }
        }
    }
}

var sender;

exports.testConstructor = function(test) {
    sender = new Sender({
        uri: 'http://localhost:8080/'
    })
    test.equal(sender.host, 'localhost')
    test.equal(sender.port, 8080)
    sender = new Sender({
        host: 'localhost',
        port: 8080,
        // Manual host & port should be preferenced
        uri: 'http://example:9090/'
    })
    test.equal(sender.host, 'localhost')
    test.equal(sender.port, 8080)
    test.done()
}

exports.testSendCall = function(test) {
    var sender = new Sender({
        uri: 'http://localhost:8080/',
        http: http_mock()
    })
    var call = {
        Method: proto.Get,
        Request: proto.GetArgs("testKey")
    }

    sender.Send(call, function(err, res) {
        if(err) {
            test.ok(false, "Err should be null " + err)
        }
        test.done()
    })
}
