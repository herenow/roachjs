var protoBuf = require('protobufjs')
var proto = require('./proto.js')

// A Call is a pending database API call.
var Call = function Call(call) {
    // Type-check
    if(typeof call.Method !== 'string') {
        throw new Error('call.Method should be of type string, received: ' + typeof call.Method)
    }
    if(! call.Request instanceof protoBuf.Builder.Message) {
        throw new Error('call.Request should be an instanceof an protocol buffers message')
    }

    this.Method = call.Method   // The name of the database command (see api.proto)
    this.Request = call.Request  // The argument to the command
    this.Callback = call.Callback || null // Optional callback once request is done
}

// now returns clock.Now() if clock is not nil; otherwise uses the
// system wall time.
function now(clock) {
    if(! clock) {
        return (new Date().getTime() * 1000 * 1000)
    }
    return clock.now()
}

// resetClientCmdID sets the client command ID if the call is for a
// read-write method. The client command ID provides idempotency
// protection in conjunction with the server.
Call.prototype.resetClientCmdID = function resetClientCmdID(clock) {
    this.Request.getHeader().set('cmd_id', new proto.ClientCmdID({
        wall_time: now(clock),
        // Note: 9223372036854775807 is the range of a positive int64)
        random: Math.floor((Math.random() * 9223372036854775807) + 1)
    }))
}

// Exports
module.exports = Call
