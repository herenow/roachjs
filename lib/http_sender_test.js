var Sender = require('./http_sender.js')
var assert = require('assert')
var nock   = require('nock')
var proto  = require('./proto.js')

var http_mock = nock('http://localhost:8080/')
				.post('/kv/db/' + proto.Get)
				.reply(200, {
					key: "test",
					value: "test"
				})
				.post('/kv/db/' + proto.Put)
				.reply(200, {
					key: "test",
					value: "test"
				})

var sender;

exports.testConstructor = function(test) {
	sender = new Sender({
		uri: 'http://localhost:8080/',
	})
	test.done()
}

exports.testGetRequestCall = function(test) {
	sender.Call(proto.Get, proto.GetRequest("testKey"), function(err, res) {
		if(err) {
			test.ok(false, "Err should be null " + err)
		}
		test.done()	
	})
}

exports.testPutRequestCall = function(test) {
	sender.Call(proto.Put, proto.PutRequest("testKey", "value"), function(err, res) {
		if(err) {
			test.ok(false, "Err should be null " + err)
		}
		test.done()	
	})
}
