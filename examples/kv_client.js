var Roach = require('../index.js')

var client = new Roach({
	host: '127.0.0.1',
	port: 8080
})

client.put("1", 'asd', function(err, res) {
	console.log('put', err, res)
})

client.get("1", function(err, res) {
	console.log('get', err, res)
})

client.increment("example_counter", 5, function(err, res) {
	console.log('increment', err, res)
})

client.get("example_counter", function(err, res) {
	console.log('get example_counter', err, res)
})

client.conditionalPut("1", "5", "10", function(err, res) {
	console.log("putConditional", err, res)
})

client.scan("1", "5", 100, function(err, res) {
	console.log("scan", err, res)
})

client.contains("1", function(err, res) {
	console.log("contains", err, res)
})

client.delete("1", function(err, res) {
	console.log("delete", err, res)
})

client.deleteRange("1", "5", 100, function(err, res) {
	console.log("deleteRange", err, res)
})
