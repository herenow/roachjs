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
	"errors"
	"reflect"
	"testing"
	"time"

	"github.com/cockroachdb/cockroach/proto"
)

// TestKVEmptyFlush verifies that flushing without preparing any
// calls is a noop.
func TestKVEmptyFlush(t *testing.T) {
	count := 0
	client := NewKV(newTestSender(func(call *Call) {
		count++
	}), nil)
	if err := client.Flush(); err != nil {
		t.Fatal(err)
	}
	if count != 0 {
		t.Errorf("expected 0 count; got %d", count)
	}
}

// TestKVClientCommandID verifies that client command ID is set
// on call.
func TestKVClientCommandID(t *testing.T) {
	count := 0
	client := NewKV(newTestSender(func(call *Call) {
		count++
		if call.Args.Header().CmdID.WallTime == 0 {
			t.Errorf("expected client command ID to be initialized")
		}
	}), nil)
	client.Call(proto.Put, testPutReq, &proto.PutResponse{})
	if count != 1 {
		t.Errorf("expected test sender to be invoked once; got %d", count)
	}
}

// TestKVPrepareAndFlush verifies that Flush sends single prepared
// call without a batch and more than one prepared calls with a batch.
func TestKVPrepareAndFlush(t *testing.T) {
	for i := 1; i < 3; i++ {
		count := 0
		client := NewKV(newTestSender(func(call *Call) {
			count++
			if i == 1 && call.Method == proto.Batch {
				t.Error("expected non-batch for a single buffered call")
			} else if i > 1 {
				if call.Method != proto.Batch {
					t.Error("expected batch for > 1 buffered calls")
				}
				if call.Args.Header().CmdID.WallTime == 0 {
					t.Errorf("expected batch client command ID to be initialized: %s", call.Args.Header().CmdID)
				}
			}
		}), nil)

		for j := 0; j < i; j++ {
			client.Prepare(proto.Put, testPutReq, &proto.PutResponse{})
		}
		if err := client.Flush(); err != nil {
			t.Fatal(err)
		}
		if count != 1 {
			t.Errorf("expected test sender to be invoked once; got %d", count)
		}
	}
}

// TestKVPrepareAndCall verifies that Call will act as a Prepare
// followed by a Flush in the event there are already-prepared
// and unflushed calls buffered.
func TestKVPrepareAndCall(t *testing.T) {
	for i := 0; i < 3; i++ {
		count := 0
		client := NewKV(newTestSender(func(call *Call) {
			count++
			if i == 0 && call.Method == proto.Batch {
				t.Error("expected non-batch for a single call")
			} else if i > 0 {
				if call.Method != proto.Batch {
					t.Errorf("expected batch for %d prepared call(s)", i)
				}
				if l := len(call.Args.(*proto.BatchRequest).Requests); l != i+1 {
					t.Errorf("expected batch to contain %d requests; got %d", i+1, l)
				}
			}
		}), nil)

		for j := 0; j < i; j++ {
			client.Prepare(proto.Put, testPutReq, &proto.PutResponse{})
		}
		if err := client.Call(proto.Put, testPutReq, &proto.PutResponse{}); err != nil {
			t.Fatal(err)
		}
		if count != 1 {
			t.Errorf("expected test sender to be invoked once; got %d", count)
		}
	}
}

// TestKVTransactionSender verifies the proper unwrapping and
// re-wrapping of the client's sender when starting a transaction.
// Also verifies that User and UserPriority are propagated to the
// transactional client.
func TestKVTransactionSender(t *testing.T) {
	client := NewKV(newTestSender(func(call *Call) {}), nil)
	client.User = "foo"
	client.UserPriority = 101
	if err := client.RunTransaction(&TransactionOptions{}, func(txn *KV) error {
		if txn.Sender() != client.Sender() {
			t.Errorf("expected wrapped sender for txn to equal original sender; %+v != %+v", txn.Sender(), client.Sender())
		}
		if txn.User != client.User {
			t.Errorf("expected txn user %s; got %s", client.User, txn.User)
		}
		if txn.UserPriority != client.UserPriority {
			t.Errorf("expected txn user priority %d; got %d", client.UserPriority, txn.UserPriority)
		}
		return nil
	}); err != nil {
		t.Errorf("unexpected error on commit: %s", err)
	}
}

// TestKVNestedTransactions verifies that trying to create nested
// transactions returns an error.
func TestKVNestedTransactions(t *testing.T) {
	client := NewKV(newTestSender(func(call *Call) {}), nil)
	client.RunTransaction(&TransactionOptions{}, func(txn *KV) error {
		if err := txn.RunTransaction(&TransactionOptions{}, func(txn *KV) error { return nil }); err == nil {
			t.Errorf("expected error starting a nested transaction")
		}
		return nil
	})
}

// TestKVCommitTransaction verifies that transaction is committed
// upon successful invocation of the retryable func.
func TestKVCommitTransaction(t *testing.T) {
	count := 0
	client := NewKV(newTestSender(func(call *Call) {
		count++
		if call.Method != proto.EndTransaction {
			t.Errorf("expected call to EndTransaction; got %s", call.Method)
		}
		if commit := call.Args.(*proto.EndTransactionRequest).Commit; !commit {
			t.Errorf("expected commit to be true; got %t", commit)
		}
	}), nil)
	if err := client.RunTransaction(&TransactionOptions{}, func(txn *KV) error {
		return nil
	}); err != nil {
		t.Errorf("unexpected error on commit: %s", err)
	}
	if count != 1 {
		t.Errorf("expected single invocation of EndTransaction; got %d", count)
	}
}

// TestKVCommitTransactionOnce verifies that if the transaction is
// ended explicitly in the retryable func, it is not automatically
// ended a second time at completion of retryable func.
func TestKVCommitTransactionOnce(t *testing.T) {
	count := 0
	client := NewKV(newTestSender(func(call *Call) {
		count++
	}), nil)
	if err := client.RunTransaction(&TransactionOptions{}, func(txn *KV) error {
		reply := &proto.EndTransactionResponse{}
		txn.Call(proto.EndTransaction, &proto.EndTransactionRequest{Commit: true}, reply)
		if reply.GoError() != nil {
			t.Fatal(reply.GoError())
		}
		return nil
	}); err != nil {
		t.Errorf("unexpected error on commit: %s", err)
	}
	if count != 1 {
		t.Errorf("expected single invocation of EndTransaction; got %d", count)
	}
}

// TestKVAbortTransaction verifies that transaction is aborted
// upon failed invocation of the retryable func.
func TestKVAbortTransaction(t *testing.T) {
	count := 0
	client := NewKV(newTestSender(func(call *Call) {
		count++
		if call.Method != proto.EndTransaction {
			t.Errorf("expected call to EndTransaction; got %s", call.Method)
		}
		if commit := call.Args.(*proto.EndTransactionRequest).Commit; commit {
			t.Errorf("expected commit to be false; got %t", commit)
		}
	}), nil)
	err := client.RunTransaction(&TransactionOptions{}, func(txn *KV) error {
		return errors.New("foo")
	})
	if err == nil {
		t.Error("expected error on abort")
	}
	if count != 1 {
		t.Errorf("expected single invocation of EndTransaction; got %d", count)
	}
}

// TestKVRunTransactionRetryOnErrors verifies that the transaction
// is retried on the correct errors.
func TestKVRunTransactionRetryOnErrors(t *testing.T) {
	TxnRetryOptions.Backoff = 1 * time.Millisecond

	testCases := []struct {
		err   error
		retry bool // Expect retry?
	}{
		{&proto.ReadWithinUncertaintyIntervalError{}, true},
		{&proto.TransactionAbortedError{}, true},
		{&proto.TransactionPushError{}, true},
		{&proto.TransactionRetryError{}, true},
		{&proto.GenericError{}, false},
		{&proto.RangeNotFoundError{}, false},
		{&proto.RangeKeyMismatchError{}, false},
		{&proto.TransactionStatusError{}, false},
	}

	for i, test := range testCases {
		count := 0
		client := NewKV(newTestSender(func(call *Call) {
			if call.Method == proto.Put {
				count++
				if count == 1 {
					call.Reply.Header().SetGoError(test.err)
				}
			}
		}), nil)
		err := client.RunTransaction(&TransactionOptions{}, func(txn *KV) error {
			reply := &proto.PutResponse{}
			return client.Call(proto.Put, testPutReq, reply)
		})
		if test.retry {
			if count != 2 {
				t.Errorf("%d: expected one retry; got %d", i, count)
			}
			if err != nil {
				t.Errorf("%d: expected success on retry; got %S", i, err)
			}
		} else {
			if count != 1 {
				t.Errorf("%d: expected no retries; got %d", i, count)
			}
			if reflect.TypeOf(err) != reflect.TypeOf(test.err) {
				t.Errorf("%d: expected error of type %T; got %T", i, test.err, err)
			}
		}
	}
}
