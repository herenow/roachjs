// Dependencies
var KV = require('./kv.js')
var Response = require('./response.js')
var proto = require('./proto.js')

// Client.js represents the exported client interface
// This is the API for our end users
var Client = function PreparedClient(sender, clock) {
	this.kv = new KV(sender, clock)
	return this
}

// Get key
Client.prototype.get = function Get(key, callback) {
	this.kv.Prepare(proto.Get, proto.GetRequest(key), callback)
}

// Put key
Client.prototype.put = function Put(key, value, callback) {
	this.kv.Prepare(proto.Put, proto.PutRequest(key, value), callback)
}

// Flush
Client.prototype.flush = function Flush(callback) {
	this.kv.Flush(callback)
}

// Response returns an object reference.
// Which in turn will be passed as the callback to any of 
// the Client methods. We will then put the callbacks response
// on this object.
Client.prototype.Response = function PrepareResponseObject() {
	return new Response() 
}


// Exports
module.exports = Client
