var Roach = require('../index.js')

var client = new Roach({
	host: '127.0.0.1',
	port: 8080
})

client.put("1", 'asd', function(err, res) {
	console.log('put', err, res)
})

client.get("1", function(err, value, res) {
	console.log('get', err, value, res)
})

client.increment("example_counter", 5, function(err, newValue, res) {
	console.log('increment', err, newValue, res)
})

client.get("example_counter", function(err, value, res) {
	console.log('get example_counter', err, value, res)
})

client.conditionalPut("1", "5", 'asd', function(err, actualValue, res) {
	console.log("putConditional", err, actualValue, res)
})

client.scan("1", "5", 100, function(err, rows, res) {
	console.log("scan", err, rows, res)
})

client.contains("1", function(err, exists, res) {
	console.log("contains", err, exists, res)
})

client.delete("1", function(err, res) {
	console.log("delete", err, res)
})

client.deleteRange("1", "5", 100, function(err, deleted, res) {
	console.log("deleteRange", err, deleted, res)
})
