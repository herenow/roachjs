// Dependencies
var KV = require('./kv.js')
var Sender = require('./http_sender.js')
var clock = require('./clock.js')

// Defaults opts
var _defaultOpts = {
	uri: 'http://localhost:8080/',
	host: 'localhost',
	port: 8080,
	ssl: false,
	user: '',
}

// Client.js represents the exported client interface
// This is the API for our end users
var Client = function NewClient(_opts) {
	if(!(this instanceof Client)) {
		return new Client(_opts)
	}

	var opts = _defaultOpts

	if(typeof _opts !== 'undefined') {
		for(var p in _opts) {
			opts[p] = _opts[p]
		}
	}

	var sender = new Sender(opts)

	this.kv = new KV(sender, clock)
}

// Get key
Client.prototype.get = function Get(key, callback) {
	this.kv.Call("Get", {
		header: {
			user: 'root',
			key: key,
		},
	}, callback)
}

// Put key
Client.prototype.put = function Put(key, value, callback) {
	// TODO: check value type, it should be 'String'
	// If not, convert it to string, then base64
	var buf = new Buffer(value).toString('base64')

	this.kv.Call("Put", {
		header: {
			user: 'root',
			key: key,
		},
		value: {
			bytes: buf,
		},	
	}, callback)
}

// Exports
module.exports = Client
