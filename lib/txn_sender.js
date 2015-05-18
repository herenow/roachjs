// Dependencies
var proto = require('./proto.js')
var CockroachError = require('./cockroach_error')

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
    this.deferRequest = null
}

// minimum priority.
TxnSender.prototype.Send = function Send(call, callback) {
    // In Go, HTTP requests are synchronous, so in the Go client all requests
    // are naturally executed serially. In JS however, we might fire off another
    // request while the first one is in flight.
    //
    // Transaction IDs are assigned by the server, so until the first request
    // returns, we don't know the transaction ID. If we fired off another
    // request, the server would assign another ID for the same transaction.
    //
    // To avoid that, we'll hold all requests until the first one returns with
    // an ID assigned.
    var queuedRequests
    if (!this.txn.id) {
        if (!this.deferRequest) {
            // This is the very first request, set up queueing
            queuedRequests = []
            this.deferRequest = function (call, callback) {
                queuedRequests.push([call, callback])
            }
        } else {
            // We are waiting for the first request to return, queue this req
            this.deferRequest(call, callback)
            return
        }
    }
    call.Request.getHeader().set('txn', this.txn)

    var self = this

    // Send call through wrapped sender.
    this.wrapped.Send(call, function(err, res) {
        if(res) {
            self.txn = res.header.txn
        }

        // Take action on various errors.
        if(err instanceof CockroachError && err.canRestart()) {
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

                    var method = proto.MethodForWrapper(req.value)
                    if(method === proto.EndTransaction) {
                        self.txnEnd = true
                    }
                }
            }
        }

        if (queuedRequests) {
            queuedRequests.forEach(function (request) {
                try {
                    self.Send(request[0], request[1])
                } catch (err) {
                    // Pass errors to the callback
                    request[1](err)
                }
            })
        }

        callback(err, res)
    })
}

// Close is a noop for the txnSender.
TxnSender.prototype.Close = function Close() {
}

// Exports
module.exports = TxnSender
