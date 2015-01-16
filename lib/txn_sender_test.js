var proto = require('./proto.js')
var TxnSender = require('./txn_sender.js')
var Call  = require('./call.js')
var testKey = proto.Key("a")
var testTS = new proto.Timestamp({wall_time: 1, logical: 1})
var testPutReq  = new proto.PutRequest({header: new proto.RequestHeader({timestamp: testTS, key: testKey})})
var testPutResp = new proto.PutResponse({header: new proto.ResponseHeader({timestamp: testTS})})
var	txnKey = proto.Key("test-txn")
var	txnID  = "ab3f1c62-2e80-473a-914e-1f534cf8e5cd"

function makeTS(walltime, logical) {
	return new proto.Timestamp({
		wall_time: walltime,
		logical:  logical,
	})
}

function newTxnSender(wrapper) {
	return new TxnSender(wrapper, {
		name: 'test',
		isolation: 0,
	})
}

function testSender(opts) {
	this.handler = opts.handler // called after standard servicing
}

function newTestSender(handler) {
	return new testSender({
		handler: handler,
	})
}

testSender.prototype.Send = function Sender(call, callback) {
	var header = call.Request.getHeader()

	header.user_priority = -1
	if(header.txn == null && header.txn.id.length == 0) {
		header.txn.key = txnKey
		header.txn.id = txnID
	}

	var reply;

	switch(call.Method) {
	case proto.Put:
		reply = testPutResp
	default:
		// Do nothing.
	}
	reply.getHeader().txn = call.Request.getHeader().txn

	if(this.handler != null) {
		this.handler(call, reply)
	}
}

testSender.prototype.Close = function Close() {
}

// TestTxnSenderRequestTxnTimestamp verifies response txn timestamp is
// always upgraded on successive requests.
exports.testTxnSenderRequestTxnTimestamp = function(test) {
	var	testCases = []
	
	testCases.push({expRequestTS: makeTS(0, 0), responseTS: makeTS(10, 0)})
	testCases.push({expRequestTS: makeTS(10, 0), responseTS: makeTS(10, 1)})
	testCases.push({expRequestTS: makeTS(10, 1), responseTS: makeTS(10, 0)})
	testCases.push({expRequestTS: makeTS(10, 1), responseTS: makeTS(20, 1)})
	testCases.push({expRequestTS: makeTS(20, 1), responseTS: makeTS(20, 1)})
	testCases.push({expRequestTS: makeTS(20, 1), responseTS: makeTS(0, 0)})
	testCases.push({expRequestTS: makeTS(20, 1), responseTS: makeTS(20, 1)})

	var testIdx = 0
	var ts = newTxnSender(newTestSender(function(call, reply) {
		var test = testCases[testIdx++]
		var compare1 = JSON.stringify(test.expRequestTS)
		var compare2 = JSON.stringify(call.Request.getHeader().txn.timestamp)
		if(! compare1 == compare2) {
			test.ok(false, testIdx + ": expected ts "+compare1+" got "+ compare2)
		}
		reply.getHeader().txn.timestamp = test.responseTS
		call.Callback(null, reply)
	}))

	function next() {
		if(testIdx >= testCases.length) {
			test.done()
			return
		}

		ts.Send(new Call({Method: proto.Put, Request: testPutReq, Callback: function(err, res) {
			next()
		}}))
	}

	next()
}

// TestTxnSenderResetTxnOnAbort verifies transaction is reset on abort.
exports.testTxnSenderResetTxnOnAbort = function(test) {
	var ts = newTxnSender(newTestSender(function(call, reply) {
		var reply = new proto.PutResponse(new proto.ResponseHeader())
		reply.getHeader().txn = call.Request.getHeader().txn
		reply.getHeader().error = new proto.TransactionAbortedError()
		call.Callback(null, reply)
	}))

	ts.Send(new Call({Method: proto.Put, Request: testPutReq, Callback: function(err, res) {
		if(res.getHeader().txn.id) {
			test.ok(false, "expected txn to be cleared")
		}
		test.done()
	}}))
}
