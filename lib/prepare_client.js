// Dependencies
var KV = require('./kv.js')
var Response = require('./response.js')
var proto = require('./proto.js')

// Client.js represents the exported client interface
// This is the API for our end users
function Client(sender, clock) {
	this.kv = new KV(sender, clock)
	return this
}

// Get key
Client.prototype.get = function Get(key, callback) {
	this.kv.Prepare(proto.Get, proto.GetArgs(key), callback)
}

// Put key
Client.prototype.put = function Put(key, value, callback) {
	this.kv.Prepare(proto.Put, proto.PutArgs(key, value), callback)
}

// Conditinal Put key
Client.prototype.conditionalPut = function ConditionalPut(key, value, expectedValue, callback) {
	this.kv.Prepare(proto.ConditionalPut, proto.ConditionalPutArgs(key, value, expectedValue), callback)
}

// Increment
Client.prototype.increment = function Increment(key, value, callback) {
	this.kv.Prepare(proto.Increment, proto.IncrementArgs(key, value), callback)
}

// Delete 
Client.prototype.delete = function Delete(key, callback) {
	this.kv.Prepare(proto.Delete, proto.DeleteArgs(key), callback)
}

// Delete Range 
Client.prototype.deleteRange = function DeleteRange(start_key, end_key, limit, callback) {
	this.kv.Prepare(proto.DeleteRange, proto.DeleteRangeArgs(start_key, end_key, limit), callback)
}

// Scan 
Client.prototype.scan = function Scan(key_start, key_end, limit, callback) {
	this.kv.Prepare(proto.Scan, proto.ScanArgs(key_start, key_end, limit), callback)
}

// Contains 
Client.prototype.contains = function Contains(key, callback) {
	this.kv.Prepare(proto.Contains, proto.ContainsArgs(key), callback)
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
