var Roach = require('../index.js')

var client = new Roach({
	host: '127.0.0.1',
	port: 8080
})

for(var i = 0; i < 10; i++) {
	(function(i) {
		var c = client.prepare()
		c.put(i, i, function(err, res) {
		})
		c.get(i, function(err, res) {
			console.log(res)
		})
		c.flush()
	})(i)
}

