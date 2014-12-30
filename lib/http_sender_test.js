var Sender = require('./http_sender.js')
var assert = require('assert')
var nock   = require('nock')

var http_mock = nock('http://localhost:8080/')
				.get('/kv/db')
				.reply(200, {
					key: 'test',
					value: 1,
				})

var sender;

// Test contructor
exports.testConstructor = function(test) {
	sender = new Sender({
		uri: 'http://localhost:8080/',
	})
	test.done()
}

// Test Call api
exports.testCall = function(test) {
	sender.Call('GET', '', function(err, res) {
		if(err) {
			return
		}
		test.equal(res.key, 'test')
		test.equal(res.value, 1)
		test.done()	
	})
}
