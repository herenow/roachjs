var proto = require('../proto.js')

// A Call is a pending database API call.
var Call = function Call(call) {
	// Type-check
	if(call.Method !== 'string') {
		throw new Error('call.Method should be of type string')
	}
	if(! call.Args instanceof proto.Request) {
		throw new Error('call.Args should be an instanceof proto.Request')
	}
	if(! call.Reply instanceof proto.Response) {
		throw new Error('call.Args should be an instanceof proto.Request')
	}

	this.Method = call.Method 	// The name of the database command (see api.proto)
	this.Args   = call.Request  // The argument to the command
	this.Reply  = call.Response // The reply from the command
}

// now returns clock.Now() if clock is not nil; otherwise uses the
// system wall time.
function now(clock) {
	if clock === null {
		return (new Date().getTime() * 1000)
	}
	return clock.Now()
}

// resetClientCmdID sets the client command ID if the call is for a
// read-write method. The client command ID provides idempotency
// protection in conjunction with the server.
Call.prototype.resetClientCmdID = function resetClientCmdID(clock) {
	// On mutating commands, set a client command ID. This prevents
	// mutations from being run multiple times on retries.
	if(proto.IsReadWrite(this.Method)) {
		this.Args.Header().CmdID = proto.ClientCmdID({
			WallTime: now(clock),
			// Note: 9223372036854775807 is the range of a positive int64) 
			Randon: math.floor((Math.random() * 9223372036854775807) + 1) 
		})
	}
}

// Exports
module.exports = Call
