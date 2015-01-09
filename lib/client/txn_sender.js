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

import "github.com/cockroachdb/cockroach/proto"

// A txnSender proxies requests to the underlying KVSender,
// automatically beginning a transaction and then propagating txn
// changes to all commands. On receipt of TransactionRetryError, the
// transaction epoch is incremented and error passed to caller. On
// receipt of TransactionAbortedError, the transaction is re-created
// and error passed to caller.
//
// txnSender is not thread safe.
function txnSender(opts) {
	this.wrapped = opts.wrapped
	this.txnEnd  = opts.txnEnd || false // True if EndTransaction was invoked internally
	this.txn     = opts.txn
}

// newTxnSender returns a new instance of txnSender which wraps a
// KVSender and uses the supplied transaction options.
// @wrapper {KVSender} 
// @opts {TransactionOptions}
function newTxnSender(wrapped, opts) {
	return new txnSender({
		wrapped: wrapped,
		txn: proto.Transaction({
			Name:      opts.Name,
			Isolation: opts.Isolation,
		}),
	})
}

// Send proxies requests to wrapped kv.KVSender instance, taking care
// to attach txn message to each request and update it on each
// response. In the event of a transaction abort, reset txn with a
// minimum priority.
txnSender.prototype.Send = function Send(call, callback) {
	// Send call through wrapped sender.
	call.Args.Header().Txn = this.txn
	
	var self = this

	this.wrapped.Send(call, function(err) {
		self.txn.Update(call.Reply.Header().Txn)

		// Take action on various errors.
		switch(call.Reply.Header().Error()) {
			// On Abort, reset the transaction so we start anew on restart.
			case proto.TransactionAbortedError:
				self.txn = proto.Transaction({
					Name:      this.txn.Name,
					Isolation: this.txn.Isolation,
					Priority:  t.Txn.Priority, // acts as a minimum priority on restart
				})
				break
			case null:
				if(call.Method === proto.EndTransaction) {
					self.txnEnd = true // set this txn as having been ended
				}
		}

		callback(err)
	})
}

// Close is a noop for the txnSender.
txnSender.prototype.Close = function Close() {
}
