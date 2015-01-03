// Dependencies
var KV = require('./kv.js')
var Sender = require('./http_sender.js')
var PreparedClient = require('./prepare_client.js')
var clock = require('./clock.js')
var proto = require('./proto.js')

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

	this.sender = sender
	this.clock  = clock
	this.kv = new KV(sender, clock)
}

// Get key
Client.prototype.get = function Get(key, callback) {
	this.kv.Call(proto.Get, proto.GetRequest(key), callback)
}

// Put key
Client.prototype.put = function Put(key, value, callback) {
	this.kv.Call(proto.Put, proto.PutRequest(key, value), callback)
}

// This will upgrade this client to a prepared client
// A prepared client, this is needed because javascript doesn't block
// And user may get out of scope during the preparing fase
// We are only changing the client interface
// The sender and clocks remains the same
Client.prototype.prepare = function Prepare() {
	console.log('calling PreparedClient()')
	return new PreparedClient(this.sender, this.clock)
}

// Exports
module.exports = Client
