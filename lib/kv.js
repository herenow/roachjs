// Dependencies
var ProtoBuf = require('protobufjs')

// Returns you a KV rpc client
// @constructor
// @param {sender} - http request client
// @param {clock}  - clock module
function KV(sender, clock) {
	this.sender = sender
	this.clock  = clock

	return this
}

// Call invokes the KV command synchronously and returns the response
// and error, if applicable. If preceeding calls have been made to
// Prepare() without a call to Flush(), this call is prepared and
// then all prepared calls are flushed.
KV.prototype.Call = function Call(method, request, callback) {
	this.sender.Call(method, request, callback)
}

// Exports
module.exports = KV
