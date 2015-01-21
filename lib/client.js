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
function NewClient(_opts) {
	if(!(this instanceof NewClient)) {
		return new NewClient(_opts)
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
	this.Call = this.kv.Call.bind(this.kv) // Default

	return this
}

// Create a new Client
// and Upgrade it to a prepared client.
// This is needed to assure "thread safety"
// Since the kv.Prepare api is expected to be used 
// in a sync fashion. 
Client.prototype.prepare = function PrepareClient() {
	var client = new Client(this.sender, this.clock)	
	client.Call = client.kv.Prepare // Upgrade
	return client
}

// Get key
Client.prototype.get = function Get(key, callback) {
	this.Call(proto.Get, proto.GetArgs(key), function(err, res) {
		// Extract value from res
		if(!err) {
			var value = res.value.bytes || null 
		}
		callback(err, value, res)
	})
}

// Put key
Client.prototype.put = function Put(key, value, callback) {
	this.Call(proto.Put, proto.PutArgs(key, value), callback)
}

// Conditinal Put key
Client.prototype.conditionalPut = function ConditionalPut(key, value, expectedValue, callback) {
	this.Call(proto.ConditionalPut, proto.ConditionalPutArgs(key, value, expectedValue), function(err, res) {
		if(!err) {
			var actualValue = res.actual_value || null
		}
		callback(err, actualValue, res)
	})
}

// Increment
Client.prototype.increment = function Increment(key, value, callback) {
	this.Call(proto.Increment, proto.IncrementArgs(key, value), function(err, res) {
		if(!err) {
			var newValue = res.new_value || null 
		}
		callback(err, newValue, res)
	})
}

// Delete 
Client.prototype.delete = function Delete(key, callback) {
	this.Call(proto.Delete, proto.DeleteArgs(key), callback)
}

// Delete Range 
Client.prototype.deleteRange = function DeleteRange(start_key, end_key, limit, callback) {
	this.Call(proto.DeleteRange, proto.DeleteRangeArgs(start_key, end_key, limit), function(err, res) {
		if(!err) {
			var deleted = res.num_deleted || null
		}
		callback(err, deleted, res)
	})
}

// Scan 
Client.prototype.scan = function Scan(key_start, key_end, limit, callback) {
	this.Call(proto.Scan, proto.ScanArgs(key_start, key_end, limit), function(err, res) {
		if(!err) {
			var rows = res.rows || null
		}
		callback(err, rows, res)
	})
}

// Contains 
Client.prototype.contains = function Contains(key, callback) {
	this.Call(proto.Contains, proto.ContainsArgs(key), function(err, res) {
		if(!err) {
			var contains = res.contains || null
		}
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
module.exports = NewClient 
