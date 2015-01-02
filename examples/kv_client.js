
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
