// Dependencies
var KV = require('./kv.js')
var Sender = require('./http_sender.js')
var PreparedClient = require('./prepare_client.js')
var proto = require('./proto.js')

// Defaults opts
function Options(opts) {
	this.uri = opts.uri || 'http://localhost:8080/'
	this.host = opts.host || 'localhost'
	this.port = opts.port || 8080
	this.ssl = opts.ssl ||false
	this.user = opts.user || 'root'
	this.http = opts.http || (this.ssl ? require('https') : require('http'))
	this.clock = function() {
		return new Date().getTime()
	}
}

// Client.js represents the exported client interface
// This is the API for our end users
var Client = function NewClient(_opts) {
	if(!(this instanceof Client)) {
		return new Client(_opts)
	}

	var opts = new Options(_opts) 

	var sender = new Sender(opts)
	var clock  = opts.clock

	this.sender = sender
	this.clock  = clock
	this.kv = new KV(sender, clock)
}

// Get key
Client.prototype.get = function Get(key, callback) {
	this.kv.Call(proto.Get, proto.GetArgs(key), function(err, res) {
		callback(err, res.value.bytes.toString())
	})
}

// Put key
Client.prototype.put = function Put(key, value, callback) {
	this.kv.Call(proto.Put, proto.PutArgs(key, value), callback)
}

// Conditinal Put key
Client.prototype.conditionalPut = function ConditionalPut(key, value, expectedValue, callback) {
	this.kv.Call(proto.ConditionalPut, proto.ConditionalPutArgs(key, value, expectedValue), callback)
}

// Increment
Client.prototype.increment = function Increment(key, value, callback) {
	this.kv.Call(proto.Increment, proto.IncrementArgs(key, value), callback)
}

// Delete 
Client.prototype.delete = function Delete(key, callback) {
	this.kv.Call(proto.Delete, proto.DeleteArgs(key), callback)
}

// Delete Range 
Client.prototype.deleteRange = function DeleteRange(start_key, end_key, limit, callback) {
	this.kv.Call(proto.DeleteRange, proto.DeleteRangeArgs(start_key, end_key, limit), callback)
}

// Scan 
Client.prototype.scan = function Scan(key_start, key_end, limit, callback) {
	this.kv.Call(proto.Scan, proto.ScanArgs(key_start, key_end, limit), callback)
}

// Contains 
Client.prototype.contains = function Contains(key, callback) {
	this.kv.Call(proto.Contains, proto.ContainsArgs(key), callback)
}

// This will upgrade this client to a prepared client
// A prepared client, this is needed because javascript doesn't block
// And user may get out of scope during the preparing fase
// We are only changing the client interface
// The sender and clocks remains the same
Client.prototype.prepare = function Prepare() {
	return new PreparedClient(this.sender, this.clock)
}

// Request to for a transactional client
Client.prototype.runTransaction = function RunTransaction(opts, txn, callback) {

	 var client = new PreparedClient(this.sender,  this.clock)
	return this.kv.RunTransaction(opts, txn, callback) 
}

// Exports
module.exports = Client
