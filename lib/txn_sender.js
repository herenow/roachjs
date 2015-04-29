// Dependencies
var proto = require('./proto.js')

// A txnSender proxies requests to the underlying KVSender,
// automatically beginning a transaction and then propagating txn
// changes to all commands. On receipt of TransactionRetryError, the
// transaction epoch is incremented and error passed to caller. On
// receipt of TransactionAbortedError, the transaction is re-created
// and error passed to caller.
//
// txnSender is not thread safe.
// @wrapper {KVSender}
// @opts {TransactionOptions}
function TxnSender(wrapped, opts) {
    this.wrapped = wrapped
    this.txnEnd  = false // True if EndTransaction was invoked internally
    this.txn     = new proto.Transaction({
        name: opts.name,
        isolation: opts.isolation || proto.SERIALIZABLE,
    })
}

// minimum priority.
TxnSender.prototype.Send = function Send(call, callback) {
    call.Request.getHeader().set('txn', this.txn)

    var self = this

    // Send call through wrapped sender.
    this.wrapped.Send(call, function(err, res) {
        if(res) {
            self.txn = res.txn
        }

        // Take action on various errors.
        if(err instanceof proto.TransactionAbortedError) {
            // On Abort, reset the transaction so we start anew on restart.
            self.txn = proto.Transaction({
                name: self.txn.name,
                isolation: self.txn.isolation,
                priority:  res.txn.priority, // acts as a minimum priority on restart
            })
        }
        else if(!err) {
            if(call.Method === proto.EndTransaction) {
                self.txnEnd = true // set this txn as having ended
            }
            else if(call.Method === proto.Batch) {
                for(var i in call.Request.requests) {
                    var req = call.Request.requests[i]

                    // Find first non-empty, it will be the request method
                    for(var prop in req) {
                        if(req[prop] != null) {
                            var method = proto.MethodForWrapper(prop)
                            if(method === proto.EndTransaction) {
                                self.txnEnd = true
                            }
                        }
                    }
                }
            }
        }

        callback(err, res)
    })
}

// Close is a noop for the txnSender.
TxnSender.prototype.Close = function Close() {
}

// Exports
module.exports = TxnSender
