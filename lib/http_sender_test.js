var Sender = require('./http_sender.js')
var assert = require('assert')
var proto  = require('./proto.js')
var EventEmmiter = require('events').EventEmitter

var http_mock =  {
	request: function(opts, callback) {
		var res = new EventEmmiter()
		
		callback(res)

		var data = {key: "test", value: "any"}
		res.emit('data', JSON.stringify(data))
		res.emit('end')
		return {
			write: function() {},
			end: function() {},
		}
	},
}
		
var sender;

exports.testConstructor = function(test) {
	sender = new Sender({
		uri: 'http://localhost:8080/',
		http: http_mock,
	})
	test.done()
}

exports.testGetRequestCall = function(test) {
	sender.Send(proto.Get, proto.GetRequest("testKey"), function(err, res) {
		if(err) {
			test.ok(false, "Err should be null " + err)
		}
		test.done()	
	})
}

exports.testPutRequestCall = function(test) {
	sender.Send(proto.Put, proto.PutRequest("testKey", "value"), function(err, res) {
		if(err) {
			test.ok(false, "Err should be null " + err)
		}
		test.done()	
	})
}
