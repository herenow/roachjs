var KV    = require('./kv.js')
var clock = require('./clock.js')
var proto = require('./proto.js')
var Call  = require('./call.js')
var testKey = proto.Key("a")
var testTS = new proto.Timestamp({wall_time: 1, logical: 1})
var testPutReq  = new proto.PutRequest({header: new proto.RequestHeader({timestamp: testTS, key: testKey})})
var testPutResp = new proto.PutResponse({header: new proto.ResponseHeader({timestamp: testTS})})
var	txnKey = proto.Key("test-txn")
var	txnID  = "ab3f1c62-2e80-473a-914e-1f534cf8e5cd"

function testSender(opts) {
	this.Send = opts.handler // called after standard servicing
}

function newTestSender(handler) {
	return new testSender({
		handler: handler,
	})
}

// TestKVEmptyFlush verifies that flushing without preparing any
// calls is a noop.
exports.testKVEmptyFlush = function(test) {
	var count = 0
	var client = new KV(newTestSender(function(call, callback) {
		count++
		callback()
	}), clock)

	client.Flush(function(err, res) {
		test.ifError(err)
		test.equal(count, 0, "expected count 0; got " + count)
		test.done()
	})
}

// TestKVClientCommandID verifies that client command ID is set
// on call.
exports.testKVClientCommandID = function(test) {
	var	count = 0
	var client = new KV(newTestSender(function(call, callback) {
		count++
		if(call.Request.header.cmd_id.wall_time == 0) {
			test.ok(false, "expected client command ID to be initialized")
		}
		callback()
	}), clock)

	client.Call(proto.Put, testPutReq, function(err, res) {
		if(count != 1) {
			test.ok(false, "expected test sender to be invoked once; got %d" + count)
		}
		test.done()
	})
}

// TestKVPrepareAndFlush verifies that Flush sends single prepared
// call without a batch and more than one prepared calls with a batch.
exports.testKVPrepareAndFlush = function(test) {
	var i = 0
	function next() {
		if(i < 3) { 
			i++
		}
		else {
			test.done()
			return
		}
		var count = 0
		var client = new KV(newTestSender(function(call, callback) {
			count++
			if(i == 1 && call.Method == proto.Batch) {
				test.ok(false, "expected non-batch for a single buffered call")
			} else if(i > 1) {
				if(call.Method != proto.Batch) {
					test.ok(false, "expected batch for > 1 buffered calls")
				}
				if(call.Request.header.cmd_id.wall_time == 0) {
					test.ok(false, "expected batch client command ID to be initialized: %s" + call.Request.header.cmd_id)
				}
			}
			callback()
		}), clock)

		for(var j = 0; j < i; j++) {
			client.Prepare(proto.Put, testPutReq)
		}

		client.Flush(function(err) {
			test.equal(count, 1, "expected test sender to be invoked once;")
			next()
		})
	}
	next()
}

// TestKVTransactionSender verifies the proper unwrapping and
// re-wrapping of the client's sender when starting a transaction.
// Also verifies that User and UserPriority are propagated to the
// transactional client.
exports.testKVTransactionSender = function(test) {
	var client = new KV(newTestSender(function(call, callback) { callback(); }), clock)
	client.user = "foo"
	client.userPriority = 101

	client.RunTransaction({}, function(txn, commit, abort) {
		test.equal(txn.Sender, client.Sender, "expected wrapped sender for txn to equal original sender;")
		test.equal(client.user, txn.user, "expected txn user to be equal client user")
		test.equal(client.userPriority, txn.userPriority, "expected client userPriority to be equal txn userPriority")
		commit(true)
	}, function(err) {
		test.done()
	})
}

// TestKVNestedTransactions verifies that trying to create nested
// transactions returns an error.
exports.testKVNestedTransactions = function(test) {
	var client = new KV(newTestSender(function(call, callback) { callback(); }), clock)
	client.RunTransaction({}, function(txn, commit, abort) {
		test.throws(function(){
			txn.RunTransaction({}, function(txn, commit, abort) {}, function(err) {})
		}, "expected error starting a nested transaction")
		test.done()
	})
}

// TestKVCommitTransaction verifies that transaction is committed
// upon successful invocation of the retryable func.
exports.testKVCommitTransaction = function(test) {
	var count = 0
	var client = new KV(newTestSender(function(call, callback) {
		count++
		test.equal(call.Method, proto.EndTransaction, "expected call to EndTransaction;")
		test.ok(call.Request.commit, "expected commit to be true;")
		callback()
	}), clock)
	client.RunTransaction({}, function(txn, commit, abort) {
		commit(true)
	}, function(err) {
		test.equal(count, 1, "expected single invocation of EndTransaction; got %d", count)
		test.done()
	}); 
}

// TestKVCommitTransactionOnce verifies that if the transaction is
// ended explicitly in the retryable func, it is not automatically
// ended a second time at completion of retryable func.
exports.testKVCommitTransactionOnce = function(test) {
	var count = 0
	var client = new KV(newTestSender(function(call, callback) {
		count++
		callback()
	}), clock)

	client.RunTransaction({}, function(txn, commit, abort) {
		txn.Call(proto.EndTransaction, new proto.EndTransactionRequest({header: new proto.RequestHeader(), commit: true}), function(err, res) {
			commit(true)
		})
	}, function(err) {
		test.equal(count, 1, "expected single invocation of EndTransaction; got " + count)
		test.done()
	})
}

// TestKVAbortTransaction verifies that transaction is aborted
// upon failed invocation of the retryable func.
exports.testKVAbortTransaction = function(test) {
	var count = 0
	var client = new KV(newTestSender(function(call, callback) {
		count++
		test.equal(call.Method, proto.EndTransaction, "expected call to EndTransaction;")
		test.equal(call.Request.commit, false, "expected commit to be false;")
		callback()
	}), clock)
	client.RunTransaction({}, function(txn, commit, abort) {
		abort(new Error("foo"))
	}, function(err) {
		if(!err) {
			test.ok(false, "expected error on abort")
		}
		test.equal(count, 1, "expected single invocation of EndTransaction; got " + count)
		test.done()
	})
}

