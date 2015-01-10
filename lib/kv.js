// Dependencies
var Response = require('./response.js')
var proto    = require('./proto.js')

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
	this.sender.Send(method, request, callback)
}

// Prepared calls buffer
// This is flushed upong KV.Flush()
KV.prototype.prepareBuffer = []

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
	if(typeof callback == 'undefined') {
		callback = empty_callback
	}

	// Validate callback
	if(callback instanceof Function) {
		this.prepareBuffer.push({
			Method: method,
			Request: request,
			Callback: callback,
		})
	}
	// Put the callback response in a response object
	// Replace the callback with a response object
	else if(callback instanceof Response) {
		var response = callback
		// TODO: Replace this function call, don't even callback
		// Write to the response object at once at .flush()
		var updateResponse = function CallbackPreparedResponse(err, res) {
			response.err = err
			response.res = res
		}

		this.prepareBuffer.push({
			Method: method,
			Request: request,
			Callback: updateResponse,
		})
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
		var call = this.prepareBuffer
		this.Call(call.Method, call.Request, call.Callback)
		return
	}

	var batch = []
	var cbs   = []

	for(var i in this.prepareBuffer) {
		var call = this.prepareBuffer[i]

		batch[i] = proto.BatchRequestPrepare(call.Method, call.Request)		
		cbs[i]   = call.Callback
	}

	var cb = function FlushCallback(err, res) {
		if(err) {
			callback(err)
			return
		}	

		for(var i in res.responses) {
			var resp = res.responses[i]
			
			if(resp.error) {
				cbs[i](resp.error, resp)	
				return
			}

			cbs[i](null, resp)
		}

		callback(null)
	}

	this.Call(proto.Batch, proto.BatchRequest(batch), cb)
	this.prepareBuffer = []
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

	if(typeof opts.name === 'undefined') {
		throw new Error('cannot initiate a transaction without a name!')
	}

	// Create a new KV for the transaction using a transactional KV sender.
	var txnSender = new TxnSender(this.sender, {
		name: opts.name,
		isolation: opts.isolation || 0,
	})

	var txnKV = new KV(txnSender, this.clock)
	//txnKV.User = kv.User
	//txnKV.UserPriority = kv.UserPriority
	
	// Run retryable in a retry loop until we encounter a success or
	// error condition this loop isn't capable of handling.
	//var retryOpts =	TxnRetryOptions
	//retryOpts.Tag = opts.Name
	retry.withBackoff(retryOpts, function Retry(retry) {
		txnSender.txnEnd = false // always reset before [re]starting txn	

		// User is trying to commit the trasaction
		var commit = function Commit() {
			if(txnSender.txnEnd === false) {
				var request = proto.EndTransactionRequest(true)
				var response = proto.EndTransactionResponse()

				txnKV.Prepare(proto.EndTransaction, request, response)

				txnKV.Flush(function(err) {
					if(err instanceof proto.ReadWithinUncertaintyIntervalError) {
						// Retry immediately on read within uncertainty interval.
						retry(null, retry.Reset)
					}
					else if(err instanceof proto.TransactionAbortedError) {
						// If the transaction was aborted, the txnSender will have created
						// a new txn. We allow backoff/retry in this case.
						retry(null, retry.Continue)
					}		
					else if(err instanceof proto.TransactionPushError) {
						// Backoff and retry on failure to push a conflicting transaction.
						retry(null, retry.Continue)
					}		
					else if(err instanceof proto.TransactionRetryError) {
						// Return RetryReset for an immediate retry (as in the case of
						// an SSI txn whose timestamp was pushed). 
						retry(null, retry.Reset)
					}	
					else {
						// For all other cases, finish retry loop, returning possible error.	
						retry(err, retry.Break)
					}
				})
			}
		}
		// Something when wrong, user is aborting
		var abbort = function Abort(err) {
			kvClient.Close()	
			txnSender.txnEnd = true

			err = err || new Error('transacation aborted by user, no error was specified.')
			
			retry(err, retry.Break)
		}

		// Run retryable transaction fnc
		try {
			retryable(txnKV, commit, abort)
		} catch(e) {
			// Abort the transaction
			abort(e)
		}
	}, function Finish(err) {
		if(err && txnSender.txnEnd === false) {
			var request = proto.EndTransactionRequest(false)
			var txnErr = err

			txnKV.Call(proto.EndTransaction, request, function(err, res) {
				if(err) {
					console.log('failure aborting transaction: %s; abort caused by: %s', res.error, txnErr)
				}

				callback(err, res)
			})
			return
		}

		callback(err)
	})
}

// Close sender
KV.prototype.Close = function Close() {
	this.sender.Close()
}

// Helper fnc, reference to an empty callback
function empty_cabllack() {}

// Exports
module.exports = KV
