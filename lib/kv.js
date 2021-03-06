// Dependencies
var TxnSender = require('./txn_sender.js')
var Call = require('./call.js')
var proto = require('./proto.js')
var retry = require('./retry.js')
var CockroachError = require('./cockroach_error')

// TxnRetryOptions sets the retry options for handling write conflicts.
var TxnRetryOptions = new retry.Options({
    backoff:     50, // ms
    maxBackoff:  5000,
    constant:    2,
    maxAttempts: 0, // retry indefinitely
})

// Returns you a KV rpc client
// @constructor
// @param {sender} - http request client
// @param {clock}  - clock module
function KV(sender, clock) {
    // User is the default user to set on API calls. If User is set to
    // non-empty in call arguments, this value is ignored.
    this.user = 'root'
    // UserPriority is the default user priority to set on API calls. If
    // UserPriority is set non-zero in call arguments, this value is
    // ignored.
    this.userPriority = 0 // int32

    this.sender = sender
    this.clock  = clock

    this.prepareBuffer = []

    return this
}

// Sender returns the sender supplied to NewKV, unless wrapped by a
// transactional sender, in which case returns the unwrapped sender.
KV.prototype.Sender = function Sender() {
    if(this.sender instanceof TxnSender) {
        return this.wrapped
    }
    else {
        return this.sender
    }
}

// Call invokes the KV command synchronously and returns the response
// and error, if applicable. If preceeding calls have been made to
// Prepare() without a call to Flush(), this call is prepared and
// then all prepared calls are flushed.
KV.prototype.Call = function KVCall(method, request, callback) {
    if (typeof callback !== 'function') {
      throw new Error('invalid callback')
    }
    var header = request.getHeader()

    if(! header.get('user')) {
        header.set('user', this.user)
    }
    if(this.userPriority > 0 && ! header.get('user_priority')) {
        header.set('user_priority', this.userPriority)
    }

    var call = new Call({
        Method: method,
        Request: request,
    })
    call.resetClientCmdID(this.clock)

    this.sender.Send(call, function(err, res) {
        if(err) {
            callback(err, null)
            return
        }

        if(!res) {
            callback(new Error('expected a res object, received nothing'), null)
            return
        }

        var header = res.header
        var error;

        if(!header) {
            error = new Error('res object had no header, expected an header')
        } else if(header.error) {
            error = new CockroachError(header.error.message, header)
        }

        if(error) {
            callback(error, res)
            return
        }

        callback(null, res)
    })
}

// Prepare accepts a KV API call, specified by method name, arguments
// and a reply struct. The call will be buffered locally until the
// first call to Flush(), at which time it will be sent for execution
// as part of a batch call. Using Prepare/Flush parallelizes queries
// and updates and should be used where possible for efficiency.
//
// For clients using an HTTP sender, Prepare/Flush allows multiple
// commands to be sent over the same connection. For transactional
// clients, Prepare/Flush can dramatically improve efficiency by
// compressing multiple writes into a single atomic update in the
// event that the writes are to keys within a single range. However,
// using Prepare/Flush alone will not guarantee atomicity. Clients
// must use a transaction for that purpose.
//
// The supplied reply struct will not be valid until after a call
// to Flush().
KV.prototype.Prepare = function Prepare(method, request, callback) {
    // Make callback optional
    if(typeof callback === 'undefined') {
        callback = empty_callback
    }

    // Validate callback
    if(callback instanceof Function) {
        var call = new Call({
            Method: method,
            Request: request,
            Callback: callback,
        })
        call.resetClientCmdID(this.clock)
        this.prepareBuffer.push(call)
    }
    // Not a valid callback
    else {
        throw new Error('invalid callback, check your code! received a: ' + typeof callback)
    }
}

// Flush sends all previously prepared calls, buffered by invocations
// of Prepare(). The calls are organized into a single batch command
// and sent together. Flush returns nil if all prepared calls are
// executed successfully. Otherwise, Flush returns the first error,
// where calls are executed in the order in which they were prepared.
// After Flush returns, all prepared reply structs will be valid.
KV.prototype.Flush = function Flush(callback) {
    if(! callback) {
        callback = empty_callback
    }

    if(this.prepareBuffer.length === 0) {
        callback(null)
        return
    }
    else if (this.prepareBuffer.length === 1) {
        var call = this.prepareBuffer[0]
        this.Call(call.Method, call.Request, function (err, res) {
            // This might look unncessarily complicated, but we want the
            // behavior for single prepared calls (this logic) to match what
            // happens for multiple prepared calls.
            //
            // The behavior is:
            // * The callbacks for KV#Prepare will never receive an error and
            //   in case of success, will receive the result value
            // * The callback to KV#Flush will receive the error, if any, but
            //   will not receive any result value
            if (err) {
                callback(err)
                return
            }
            call.Callback(null, res)
            callback(null);
        })
        this.prepareBuffer = []
        return
    }

    // Copy flush buffer somewhere else
    // (or at least keep a reference so it won't be GC)
    var batch = []
    for(var i in this.prepareBuffer) {
        batch[i] = this.prepareBuffer[i]
    }

    // Clear buffer
    this.prepareBuffer = []

    // Make call
    this.Call(proto.Batch, new proto.BatchArgs(batch), function FlushCallback(err, res) {
        if(err) {
            callback(err)
            return
        }

        for(var i in res.responses) {
            var call = batch[i]
            var method = call.Method
            var resp = res.responses[i][proto.BatchFindWrapperProp(method)]
            var header = resp.header

            batch[i].Callback(header.error, resp)
        }

        callback(null)
    })
}

// RunTransaction executes retryable in the context of a distributed
// transaction. The transaction is automatically aborted if retryable
// returns any error aside from recoverable internal errors, and is
// automatically committed otherwise. retryable should have no side
// effects which could cause problems in the event it must be run more
// than once. The opts struct contains transaction settings.
//
// Calling RunTransaction on the transactional KV client which is
// supplied to the retryable function is an error.
KV.prototype.RunTransaction = function RunTransaction(opts, retryable, callback) {
    if(this.sender instanceof TxnSender) {
        throw new Error('cannot invoke RunTransaction on an already-transactional client')
    }

    // Create a new KV for the transaction using a transactional KV sender.
    var txnSender = new TxnSender(this.sender, {
        name: opts.name || '',
        isolation: opts.isolation || proto.SERIALIZABLE,
    })

    var txnKV = new KV(txnSender, this.clock)
    txnKV.user = this.user
    txnKV.userPriority = this.userPriority

    // Run retryable in a retry loop until we encounter a success or
    // error condition this loop isn't capable of handling.
    var retryOpts = TxnRetryOptions
    retryOpts.tag = opts.name
    retry.WithBackoff(retryOpts, function Retry(retryCallback) {
        txnSender.txnEnd = false // always reset before [re]starting txn

        // User is trying to commit the trasaction
        var commit = function Commit() {
            if(txnSender.txnEnd === false) {
                var request = new proto.EndTransactionRequest({
                    header: new proto.RequestHeader(), // avoid using null headers
                    commit: true,
                })

                txnKV.Prepare(proto.EndTransaction, request, function txnResponseCallback(err, res) {
                    // TODO: i'm not sure what this err is
                    // maybe this err is only for http connections errors
                    // I'm not sure flush returns real db errors
                    if(err) {
                        // For all other cases, finish retry loop, returning possible error.
                        retryCallback(err, retry.Break)
                    }
                })

                txnKV.Flush(function(err) {
                    if(err instanceof CockroachError && err.canRestart()) {
                        retryCallback(null, err.getRestartPolicy())
                    } else {
                        // Failed to run transaction batch
                        // Abort everything...
                        retryCallback(err, retry.Break)
                    }
                })
            }
            else {
                // Break retry loop
                // Someone else has ended the transaction
                retryCallback(null, retry.Break)
            }
        }
        // Something went wrong, user is aborting
        var abort = function Abort(err) {
            err = err || new Error('transaction aborted by user, no error was specified.')

            retryCallback(err, retry.Break)
        }

        // Run retryable transaction function
        try {
            retryable(txnKV, commit, abort)
        } catch(e) {
            // Abort the transaction
            abort(e)
        }
    }, function Finish(err) {
        if(err && txnSender.txnEnd === false) {
            var request = new proto.EndTransactionRequest({
                header: new proto.RequestHeader(),
                commit: false,
            })
            var txnErr = err

            txnKV.Call(proto.EndTransaction, request, function(err, res) {
                if(err) {
                    console.log('failure aborting transaction: %s; abort caused by: %s', txnSender.txn.name, txnErr)
                }

                txnKV.Close()
                txnSender.txnEnd = true

                callback(err || txnErr, res)
            })
            return
        }

        txnKV.Close()

        callback(err)
    })
}

// Close sender
KV.prototype.Close = function Close() {
    this.sender.Close()
}

// Helper fnc, reference to an empty callback
function empty_callback() {}

// Exports
module.exports = KV
