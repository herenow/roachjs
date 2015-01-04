var Roach = require('../index.js')

var client = new Roach({
	host: '127.0.0.1',
	port: 8080
})

var c = client.prepare()

var putResp = c.Response()
var getResp = c.Response()

c.put("key", "value", putResp)
c.get("key", getResp)

c.flush(function(err) {
	if(err) {
		console.log(err)
		return
	}

	console.log('putResp', putResp)
	console.log('getResp', getResp)
})

