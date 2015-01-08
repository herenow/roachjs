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
	this.sender.Call(method, request, callback)
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
	if(this.prepareBuffer.length === 0) {
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
			if(callback) {
				callback(err)
			}
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

		if(callback) {
			callback(null)
		}
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

	// Create a new KV for the transaction using a transactional KV sender.
	var txnSender = new TxnSender({{{}}})
	txnSender := newTxnSender(kv.Sender(), opts)
	txnKV := NewKV(txnSender, kv.clock)
	txnKV.User = kv.User
	txnKV.UserPriority = kv.UserPriority
	defer txnKV.Close()

	// Run retryable in a retry loop until we encounter a success or
	// error condition this loop isn't capable of handling.
	retryOpts := TxnRetryOptions
	retryOpts.Tag = opts.Name
	if err := util.RetryWithBackoff(retryOpts, func() (util.RetryStatus, error) {
		txnSender.txnEnd = false // always reset before [re]starting txn
		err := retryable(txnKV)
		if err == nil && !txnSender.txnEnd {
			// If there were no errors running retryable, commit the txn. This
			// may block waiting for outstanding writes to complete in case
			// retryable didn't -- we need the most recent of all response
			// timestamps in order to commit.
			etArgs := &proto.EndTransactionRequest{Commit: true}
			etReply := &proto.EndTransactionResponse{}
			// Prepare and flush for end txn in order to execute entire txn in
			// a single round trip if possible.
			txnKV.Prepare(proto.EndTransaction, etArgs, etReply)
			err = txnKV.Flush()
		}
		switch t := err.(type) {
		case *proto.ReadWithinUncertaintyIntervalError:
			// Retry immediately on read within uncertainty interval.
			return util.RetryReset, nil
		case *proto.TransactionAbortedError:
			// If the transaction was aborted, the txnSender will have created
			// a new txn. We allow backoff/retry in this case.
			return util.RetryContinue, nil
		case *proto.TransactionPushError:
			// Backoff and retry on failure to push a conflicting transaction.
			return util.RetryContinue, nil
		case *proto.TransactionRetryError:
			// Return RetryReset for an immediate retry (as in the case of
			// an SSI txn whose timestamp was pushed).
			return util.RetryReset, nil
		default:
			// For all other cases, finish retry loop, returning possible error.
			return util.RetryBreak, t
		}
	}); err != nil && !txnSender.txnEnd {
		etArgs := &proto.EndTransactionRequest{Commit: false}
		etReply := &proto.EndTransactionResponse{}
		txnKV.Call(proto.EndTransaction, etArgs, etReply)
		if etReply.Header().GoError() != nil {
			log.Errorf("failure aborting transaction: %s; abort caused by: %s", etReply.Header().GoError(), err)
		}
		return err
	}
	return nil
}


// Exports
module.exports = KV
