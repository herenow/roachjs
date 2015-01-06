var assert = require('assert')
var proto  = require('./proto.js')

exports.testRequest = function(test) {
	try {
		var request = proto.Request()
	} catch(e) {
		return
	}
	test.done()
}

exports.testGetRequest = function(test) {
	var key = "testKey"
	var request = proto.GetRequest(key)
	test.equal(request.header.key, new Buffer(key).toString('base64'))
	test.done()
}

exports.testPutRequest = function(test) {
	var key = "testKey"
	var value = "khan"
	var request = proto.PutRequest(key, value)
	test.equal(request.header.key, new Buffer(key).toString('base64'))
	test.equal(request.value.bytes, new Buffer(value).toString('base64'))
	test.done()
}
