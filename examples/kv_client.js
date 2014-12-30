
var Roach = require('../index.js')

var client = new Roach({
	host: '127.0.0.1',
	port: 8080
})

client.put('hjk', 'asd', function(err, res) {
	console.log('put', err, res)
})

client.get('hjk', function(err, res) {
	console.log('get', err, res)
})
