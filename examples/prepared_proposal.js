var Roach = require('../index.js')

var client = new Roach({
	host: '127.0.0.1',
	port: 8080
})

var c = client.prepare()

var putDone = c.put("key", "value")
var getDone = c.get("key")

c.flush(function(err) {
	if(err) {
		console.log(err)
		return
	}

	console.log('putDone', putDone.err, putDone.res)
	console.log('getDone', getDone.err, getDone.res)
})

