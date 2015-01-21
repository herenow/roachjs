// Dependencies
var KV = require('./kv.js')
var Sender = require('./http_sender.js')
var proto = require('./proto.js')

// Defaults opts
function Options(opts) {
	this.uri = opts.uri || 'http://localhost:8080/'
	this.host = opts.host || 'localhost'
	this.port = opts.port || 8080
	this.ssl = opts.ssl ||false
	this.user = opts.user || 'root'
	this.http = opts.http || (this.ssl ? require('https') : require('http'))
	this.clock = opts.clock || require('./clock.js') 
}

// Client interface fabricator
var ClientFabric = function NewClient(_opts) {
	if(!(this instanceof Client)) {
		return new Client(_opts)
	}

	var opts = new Options(_opts) 

	this.sender = new Sender(opts)
	this.clock  = opts.clock

	return new Client(this.sender, this.clock)
}

// Client.js represents the exported client interface
// This is the API for our end users
function Client(sender, clock) {
	this.kv = new KV(sender, clock)
	this.sender = this.kv.Call // Default
}

// Create a new Client
// and Upgrade it to a prepared client.
// This is needed to assure "thread safety"
// Since the kv.Prepare api is expected to be used 
// in a sync fashion. 
Client.prototype.prepare = function PrepareClient() {
	var client = new Client(this.sender, this.clock)	
	client.sender = client.kv.Prepare
	return client
}

// Get key
Client.prototype.get = function Get(key, callback) {
	this.sender(proto.Get, proto.GetArgs(key), function(err, res) {
		// Extract value from res
		var value = res.value.bytes || null 
		callback(err, value, res)
	})
}

// Put key
Client.prototype.put = function Put(key, value, callback) {
	this.sender(proto.Put, proto.PutArgs(key, value), callback)
}

// Conditinal Put key
Client.prototype.conditionalPut = function ConditionalPut(key, value, expectedValue, callback) {
	this.sender(proto.ConditionalPut, proto.ConditionalPutArgs(key, value, expectedValue), function(err, res) {
		var actualValue = res.actual_value || null
		callback(err, actualValue, res)
	})
}

// Increment
Client.prototype.increment = function Increment(key, value, callback) {
	this.sender(proto.Increment, proto.IncrementArgs(key, value), function(err, res) {
		var newValue = res.new_value || null 
		callback(err, newValue, res)
	})
}

// Delete 
Client.prototype.delete = function Delete(key, callback) {
	this.sender(proto.Delete, proto.DeleteArgs(key), callback)
}

// Delete Range 
Client.prototype.deleteRange = function DeleteRange(start_key, end_key, limit, callback) {
	this.sender(proto.DeleteRange, proto.DeleteRangeArgs(start_key, end_key, limit), function(err, res) {
		var deleted = res.num_deleted || null
		callback(err, deleted, res)
	})
}

// Scan 
Client.prototype.scan = function Scan(key_start, key_end, limit, callback) {
	this.sender(proto.Scan, proto.ScanArgs(key_start, key_end, limit), function(err, res) {
		var rows = res.rows || null
		callback(err, rows, res)
	})
}

// Contains 
Client.prototype.contains = function Contains(key, callback) {
	this.sender(proto.Contains, proto.ContainsArgs(key), function(err, res) {
		var contains = res.contains || null
		callback(err, contains, res)
	})
}

// Flush prepared buffer
Client.prototype.flush = function Flush(callback) {
	this.kv.Flush(callback)
}

// Request to for a transactional client
Client.prototype.runTransaction = function RunTransaction(opts, txn, callback) {
	var client = new Client(this.sender, this.clock)
	client.kv.RunTransaction(opts, function TxnFnc(_kv, commit, abort){
		// Upgrade the standard kv client to our client
		txn(client, commit, abort)	
	}, callback) 
	return 
}

// Exports
module.exports = ClientFabric
