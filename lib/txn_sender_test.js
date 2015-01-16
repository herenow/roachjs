var proto = require('./proto.js')
var	txnKey = proto.Key("test-txn")
var	txnID  = "ab3f1c62-2e80-473a-914e-1f534cf8e5cd"

function makeTS(walltime, logical) {
	return proto.Timestamp({
		WallTime: walltime,
		Logical:  logical,
	})
}

function testSender(opts) {
	this.handler = opts.handler || throw Error('no handler') // called after standard servicing
}

//function newTestSender(handler (*Call)) *testSender {
function newTestSender(handler) {
	return new testSender({
		handler: handler,
	})
}

testSender.prototype.Send = function Sender(call) {
	header := call.Args.Header()
	header.UserPriority = gogoproto.Int32(-1)
	if header.Txn != nil && len(header.Txn.ID) == 0 {
		header.Txn.Key = txnKey
		header.Txn.ID = txnID
	}
	call.Reply.Reset()
	switch call.Method {
	case proto.Put:
		gogoproto.Merge(call.Reply, testPutResp)
	default:
		// Do nothing.
	}
	call.Reply.Header().Txn = gogoproto.Clone(call.Args.Header().Txn).(*proto.Transaction)

	if ts.handler != nil {
		ts.handler(call)
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
	var ts = newTxnSender(newTestSender(func(call *Call) {
		test := testCases[testIdx]
		if !test.expRequestTS.Equal(call.Args.Header().Txn.Timestamp) {
			t.Errorf("%d: expected ts %s got %s", testIdx, test.expRequestTS, call.Args.Header().Txn.Timestamp)
		}
		call.Reply.Header().Txn.Timestamp = test.responseTS
	}), new proto.TransactionOptions{})

	for testIdx = range testCases {
		ts.Send(&Call{Method: proto.Put, Args: testPutReq, Reply: &proto.PutResponse{}})
	}
}

// TestTxnSenderResetTxnOnAbort verifies transaction is reset on abort.
exports.testTxnSenderResetTxnOnAbort = function(test) {
	var ts = newTxnSender(newTestSender(function(method, request) {
		request.Reply.Header().Txn = gogoproto.Clone(call.Args.Header().Txn).(*proto.Transaction)
		call.Reply.Header().SetGoError(&proto.TransactionAbortedError{})
	}), &TransactionOptions{})

	reply := &proto.PutResponse{}
	ts.Send(&Call{Method: proto.Put, Args: testPutReq, Reply: reply})

	if len(ts.txn.ID) != 0 {
		t.Errorf("expected txn to be cleared")
	}
}
