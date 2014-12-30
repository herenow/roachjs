// Dependencies
var ProtoBuf = require('protobufjs')

// Constructor
function KV(sender, clock) {
	this.sender = sender
	this.clock  = clock

	return this
}

// Call invokes the KV command synchronously and returns the response
// and error, if applicable. If preceeding calls have been made to
// Prepare() without a call to Flush(), this call is prepared and
// then all prepared calls are flushed.
KV.prototype.Call = function Call(method, data, callback) {
	this.sender.Call(method, data, callback)
}

// Exports
module.exports = KV
