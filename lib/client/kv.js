// Copyright 2014 The Cockroach Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License. See the AUTHORS file
// for names of contributors.
//
// Author: Spencer Kimball (spencer.kimball@gmail.com)

package client

import (
	"bytes"
	"encoding/gob"
	"time"

	gogoproto "code.google.com/p/gogoprotobuf/proto"
	"github.com/cockroachdb/cockroach/proto"
	"github.com/cockroachdb/cockroach/util"
	"github.com/cockroachdb/cockroach/util/log"
)

// TxnRetryOptions sets the retry options for handling write conflicts.
var TxnRetryOptions = util.RetryOptions{
	Backoff:     50 * time.Millisecond,
	MaxBackoff:  5 * time.Second,
	Constant:    2,
	MaxAttempts: 0, // retry indefinitely
}

// TransactionOptions are parameters for use with KV.RunTransaction.
function TransactionOptions(opts) {
	this.Name = opts.Name // Concise desc of txn for debugging
	this.Isolation = opts.Isolation // proto.IsolationType
}

// KVSender is an interface for sending a request to a Key-Value
// database backend.
type KVSender interface {
	// Send invokes the Call.Method with Call.Args and sets the result
	// in Call.Reply.
	Send(*Call)
	// Close frees up resources in use by the sender.
	Close()
}

// A Clock is an interface which provides the current time.
type Clock interface {
	// Now returns nanoseconds since the Jan 1, 1970 GMT.
	Now() int64
}

// KV provides serial access to a KV store via Call and parallel
// access via Prepare and Flush. A KV instance is not thread safe.
function KV(opts) {
	// User is the default user to set on API calls. If User is set to
	// non-empty in call arguments, this value is ignored.
	this.User = opts.User 
	// UserPriority is the default user priority to set on API calls. If
	// UserPriority is set non-zero in call arguments, this value is
	// ignored.
	this.UserPriority = UserPriority // int32

	this.sender = opts.KVSender 
	this.clock  = opts.Clock
	this.prepared = [] // *Call
}

// NewKV creates a new instance of KV using the specified sender. To
// create a transactional client, the KV struct should be manually
// initialized in order to utilize a txnSender. Clock is used to
// formulate client command IDs, which provide idempotency on API
// calls. If clock is nil, uses time.UnixNanos as default
// implementation.
function NewKV(sender, clock) {
	return new KV({
		sender: sender,
		clock:  clock,
	})
}

// Sender returns the sender supplied to NewKV, unless wrapped by a
// transactional sender, in which case returns the unwrapped sender.
KV.prototype.Sender = function Sender() {
	if(this.sender instanceof txnSender) {
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
KV.prototype.Call = function Call(method, args, reply, callback) {
	if this.prepared.length > 0 {
		this.Prepare(method, args, reply)
		return this.Flush()
	}
	if args.Header().User === "" {
		args.Header().User = this.User
	}
	if args.Header().UserPriority == null && this.UserPriority != 0 {
		args.Header().UserPriority = this.UserPriority
	}

	var call = new Call({
		Method: method,
		Args:   args,
		Reply:  reply,
	})
	call.resetClientCmdID(this.clock)
	this.sender.Send(call, function(err) {
		if(err) {
			callback(err)
		}

		var respErr = call.Reply.Header().Error()

		if(respErr) {
			callback(err)
		}
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
KV.prototype.Prepare = function Prepare(method, args, reply, callback) {
	var call = new Call({
		Method: method,
		Args:   args,
		Reply:  reply,
	})
	call.resetClientCmdID(this.clock)
	this.prepared.push(call)
}

// Flush sends all previously prepared calls, buffered by invocations
// of Prepare(). The calls are organized into a single batch command
// and sent together. Flush returns nil if all prepared calls are
// executed successfully. Otherwise, Flush returns the first error,
// where calls are executed in the order in which they were prepared.
// After Flush returns, all prepared reply structs will be valid.
KV.prototype.Flush = function Flush(callback) {
	if (this.prepared.length === 0) {
		callback(new Error('nothing to flush.'))
		return
	}
	else if (this.prepared.length === 1) {
		var call = this.prepared[0]
		this.prepared = []
		this.Call(call.Method, call.Args, call.Reply, callback)
		return
	}
	var replies = [] 
	var batch = []
	for(var i in this.prepared) {
		var call = this.prepared[i]
		batch[i] = proto.BatchRequestPrepare(call.Method, call.Args)		
		replies.push(call.Reply)
	}
	this.prepared = []
	this.Call(proto.Batch, proto.BatchRequest(batch), reply, function(err) {
		if(err) {
			callback(err)
			return
		}

		// Push responses
		for(var i in replies) {
			var reply = replies[i]

			//reply = 
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
KV.prototype.RunTransaction = function RunTransaction(opts *TransactionOptions, retryable func(txn *KV) error) error {
	if _, ok := kv.sender.(*txnSender); ok {
		return util.Errorf("cannot invoke RunTransaction on an already-transactional client")
	}

	// Create a new KV for the transaction using a transactional KV sender.
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

// Close closes the KV client and its sender.
KV.prototype.Close = function Close() {
	this.sender.Close()
}
