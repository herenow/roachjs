var Sender = require('./http_sender.js')
var assert = require('assert')
var proto  = require('./proto.js')
var EventEmmiter = require('events').EventEmitter

var http_mock =  {
	request: function(opts, callback) {
		var res = new EventEmmiter()
		res.statusCode = 200
		
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

exports.testPutRequestCall = function(test) {
	var call = {
		Method: proto.Put,
		Request: proto.PutArgs("testKey", "asdas")
	}
		
	sender.Send(call, function(err, res) {
		if(err) {
			test.ok(false, "Err should be null " + err)
		}
		test.done()	
	})
}
