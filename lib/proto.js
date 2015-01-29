// Protocol buffers file 
var protoBuf = require('protobufjs')
var proto = require('./proto/api.js')

// Extend it with some sugar
// RPC commands (Constants)
// See: https://github.com/cockroachdb/cockroach/blob/81f95062c69552fdbbb3c1387ae79becdc58eb80/proto/api.go#L86
//
// Contains determines whether the KV map contains the specified key.	    
proto.Contains =  "Contains"
// Get fetches the value for a key from the KV map, respecting a
// possibly historical timestamp. If the timestamp is 0, returns
// the most recent value.
proto.Get = "Get"
// Put sets the value for a key at the specified timestamp. If the
// timestamp is 0, the value is set with the current time as timestamp.
proto.Put = "Put"
// ConditionalPut sets the value for a key if the existing value
// matches the value specified in the request. Specifying a null value
// for existing means the value must not yet exist.
proto.ConditionalPut = "ConditionalPut"
// Increment increments the value at the specified key. Once called
// for a key, Put & Get will return errors; only Increment will
// continue to be a valid command. The value must be deleted before
// it can be reset using Put.
proto.Increment = "Increment"
// Delete removes the value for the specified key.
proto.Delete = "Delete"
// DeleteRange removes all values for keys which fall between
// args.RequestHeader.Key and args.RequestHeader.EndKey, with
// the latter endpoint excluded.
proto.DeleteRange = "DeleteRange"
// Scan fetches the values for all keys which fall between
// args.RequestHeader.Key and args.RequestHeader.EndKey, with
// the latter endpoint excluded.
proto.Scan = "Scan"
// EndTransaction either commits or aborts an ongoing transaction.
proto.EndTransaction = "EndTransaction"
// ReapQueue scans and deletes messages from a recipient message
// queue. ReapQueueRequest invocations must be part of an extant
// transaction or they fail. Returns the reaped queue messsages, up to
// the requested maximum. If fewer than the maximum were returned,
// then the queue is empty.
proto.ReapQueue = "ReapQueue"
// EnqueueUpdate enqueues an update for eventual execution.
proto.EnqueueUpdate = "EnqueueUpdate"
// EnqueueMessage enqueues a message for delivery to an inbox.
proto.EnqueueMessage = "EnqueueMessage"
// Batch executes a set of commands in parallel.
proto.Batch = "Batch"
// AdminSplit is called to coordinate a split of a range.
proto.AdminSplit = "AdminSplit"

// ReadMethods specifies the set of methods which read and return data.
proto.ReadMethods = stringSet(
    proto.Contains,
    proto.Get,
    proto.ConditionalPut,
    proto.Increment,
    proto.Scan,
    proto.ReapQueue
)

// WriteMethods specifies the set of methods which write data.
proto.WriteMethods = stringSet(
    proto.Put,
    proto.ConditionalPut,
    proto.Increment,
    proto.Delete,
    proto.DeleteRange,
    proto.EndTransaction,
    proto.ReapQueue,
    proto.EnqueueUpdate,
    proto.EnqueueMessage,
    proto.Batch
)

// TxnMethods specifies the set of methods which leave key intents
// during transactions.
proto.TxnMethods = stringSet(
    proto.Put,
    proto.ConditionalPut,
    proto.Increment,
    proto.Delete,
    proto.DeleteRange,
    proto.ReapQueue,
    proto.EnqueueUpdate,
    proto.EnqueueMessage
)

// Helper fnc to create a get request proto
proto.GetArgs = function GetArgs(key) {
    var header =  new proto.RequestHeader({
	key: proto.Key(key)
    })

    return new proto.GetRequest(header) 
}

// Helper fnc to create an increment request proto
proto.IncrementArgs = function IncrementArgs(key, increment) {
    var header = new proto.RequestHeader({
	key: proto.Key(key)
    })

    var request = new proto.IncrementRequest({
	header: header,
	increment: proto.Integer(increment)
    })

    return request
}

proto.PutArgs = function PutArgs(key, value) {
    var header = new proto.RequestHeader({
	key: proto.Key(key)
    })

    var request = new proto.PutRequest({
	header: header,
	value: new proto.Value({
	    bytes: proto.BytesValue(value)
	})
    })
    // TODO: calculate checksum

    return request
}

proto.ConditionalPutArgs = function ConditionalPutArgs(key, value, expectedValue) {
    var header = new proto.RequestHeader({
	key: proto.Key(key)
    })

    var request = new proto.ConditionalPutRequest({
	header: header,
	value: new proto.Value({
	    bytes: proto.BytesValue(value)
	}),
	exp_value: new proto.Value({
	    bytes: proto.ExpectedValue(expectedValue)
	})
    })
    // TODO: calculate checksum

    return request
}

proto.DeleteArgs = function DeleteArgs(key) {
    var header = new proto.RequestHeader({
	key: proto.Key(key)
    })

    var request = new proto.DeleteRequest(header)
    
    return request
}

proto.DeleteRangeArgs = function DeleteRangeArgs(key, endKey, maxEntries) {
    var header = new proto.RequestHeader({
	key: proto.Key(key),
	end_key: proto.Key(key),
    })

    var request = new proto.DeleteRangeRequest({
	header: header,
	max_entries_to_delete: proto.Integer(maxEntries)
    })

    return request
}

proto.ScanArgs = function ScanArgs(key, endKey, maxResults) {
    var header = new proto.RequestHeader({
	key: proto.Key(key),
	end_key: proto.Key(key)
    })

    var request = new proto.ScanRequest({
	header: header,
	max_results: proto.Integer(maxResults)
    })

    return request
}

proto.ContainsArgs = function ContainsArgs(key) {
    var header = new proto.RequestHeader({
	key: proto.Key(key)
    })

    return new proto.ContainsRequest(header) 
}

// Batch request
proto.BatchArgs = function BatchArgs(batch) {
    var header = new proto.RequestHeader()
    var requests = []

    for(var i in batch) {
	var call = batch[i]
	requests[i] = new proto.RequestUnion(
	    proto.BatchRequestPrepare(call.Method, call.Request)
	)
    }

    var request = new proto.BatchRequest({
	header: header,
	requests: requests
    })

    return request
}

// This fnc returns the apropiate container for the batch request
// Each batch request must be encapsulated by its apropiate method
// Ported from https://github.com/cockroachdb/cockroach/blob/master/proto/api.proto#L303
proto.BatchRequestPrepare = function BatchRequestPrepare(method, request) {
    var wrapped = {}
    var prop	= proto.BatchFindWrapperProp(method)

    wrapped[prop] = request

    return wrapped 
}

// Convert the rpc method to a proper batch request wrapper propertie
// A batch request contains an array, inside the array there are a series
// of objects, this object will contain a propertie refering to the rpc method.
// There could be an autonomous way of doing this, but for now i'll do it manually.
// See: https://github.com/cockroachdb/cockroach/blob/master/proto/api.proto#L303
proto.BatchFindWrapperProp = function BatchFindWrapperProp(method) {
    switch(method) {
	case proto.Contains:
	    return 'contains'
	case proto.Get:
	    return 'get'
	case proto.Put:
	    return 'put'
	case proto.ConditionalPut:
	    return 'conditional_put'
	case proto.Increment:
	    return 'increment'
	case proto.Delete:
	    return 'delete'
	case proto.DeleteRange:
	    return 'delete_range'
	case proto.Scan:
	    return 'scan'
	case proto.EndTransaction:
	    return 'end_transaction'
	case proto.ReapQueue:
	    return 'reap_queue'
	case proto.EnqueueUpdate:
	    return 'enqueue_update'
	case proto.EnqueueMessage:
	    return 'enqueue_message'
	default:
	    throw new Error('invalid method suplied, cannot prepare the request.')
    }	
}

// Reverse method from proto.BatchFindWrapperProp
// See: https://github.com/cockroachdb/cockroach/blob/master/proto/api.proto#L303
proto.MethodForWrapper = function MethodForWrapper(wrapper) {
    switch(wrapper) {
	case 'contains':
	    return proto.Contains
	case 'get':
	    return proto.Get
	case 'put':
	    return proto.Put
	case 'conditional_put':
	    return proto.ConditionalPut
	case 'increment':
	    return proto.Increment
	case 'delete':
	    return proto.Delete
	case 'delete_range':
	    return proto.DeleteRange
	case 'scan':
	    return proto.Scan
	case 'end_transaction':
	    return proto.EndTransaction
	case 'reap_queue':
	    return proto.ReapQueue
	case 'enqueue_update':
	    return proto.EnqueueUpdate
	case 'enqueue_message':
	    return proto.EnqueueMessage
	default:
	    throw new Error('invalid wrapper suplied, cannot return the request method.')
    }	
}


// CreateArgs returns an allocated request according to the specified method.
proto.CreateArgs = function CreateArgs(method) {
    switch(method) {
    case proto.Contains:
	return new proto.ContainsRequest()
    case proto.Get:
	return new proto.GetRequest()
    case proto.Put:
	return new proto.PutRequest()
    case proto.ConditionalPut:
	return new proto.ConditionalPutRequest()
    case proto.Increment:
	return new proto.IncrementRequest()
    case proto.Delete:
	return new proto.DeleteRequest()
    case proto.DeleteRange:
	return new proto.DeleteRangeRequest()
    case proto.Scan:
	return new proto.ScanRequest()
    case proto.EndTransaction:
	return new proto.EndTransactionRequest()
    case proto.ReapQueue:
	return new proto.ReapQueueRequest()
    case proto.EnqueueUpdate:
	return new proto.EnqueueUpdateRequest()
    case proto.EnqueueMessage:
	return new proto.EnqueueMessageRequest()
    case proto.Batch:
	return new proto.BatchRequest()
    default:
	throw new Error('invalid method suplied (' + method + '), cannot create request')
    }
}

// CreateReply returns an allocated response according to the specified method.
proto.CreateReply = function CreateReply(method) {
    switch(method) {
    case proto.Contains:
	return new proto.ContainsResponse()
    case proto.Get:
	return new proto.GetResponse()
    case proto.Put:
	return new proto.PutResponse()
    case proto.ConditionalPut:
	return new proto.ConditionalPutResponse()
    case proto.Increment:
	return new proto.IncrementResponse()
    case proto.Delete:
	return new proto.DeleteResponse()
    case proto.DeleteRange:
	return new proto.DeleteRangeResponse()
    case proto.Scan:
	return new proto.ScanResponse()
    case proto.EndTransaction:
	return new proto.EndTransactionResponse()
    case proto.ReapQueue:
	return new proto.ReapQueueResponse()
    case proto.EnqueueUpdate:
	return new proto.EnqueueUpdateResponse()
    case proto.EnqueueMessage:
	return new proto.EnqueueMessageResponse()
    case proto.Batch:
	return new proto.BatchResponse()
    default:
	throw new Error('invalid method suplied (' + method + '), cannot create response')
    }
}

// GetResponseBuilder returns the apropiate response builder, for each rpc method.
proto.GetResponseBuilder = function GetResponseBuilder(method) {
    switch(method) {
    case proto.Contains:
	return proto.ContainsResponse
    case proto.Get:
	return proto.GetResponse
    case proto.Put:
	return proto.PutResponse
    case proto.ConditionalPut:
	return proto.ConditionalPutResponse
    case proto.Increment:
	return proto.IncrementResponse
    case proto.Delete:
	return proto.DeleteResponse
    case proto.DeleteRange:
	return proto.DeleteRangeResponse
    case proto.Scan:
	return proto.ScanResponse
    case proto.EndTransaction:
	return proto.EndTransactionResponse
    case proto.ReapQueue:
	return proto.ReapQueueResponse
    case proto.EnqueueUpdate:
	return proto.EnqueueUpdateResponse
    case proto.EnqueueMessage:
	return proto.EnqueueMessageResponse
    case proto.Batch:
	return proto.BatchResponse
    default:
	throw new Error('invalid method suplied (' + method + '), cannot create response constructor')
    }
}

// Validate and convert key to proper format
proto.Key = function Key(key) {
    if(typeof key === 'string') {
	return new Buffer(key)
    }
    else if(key instanceof Buffer) {
	return key
    }
    else {
	throw new Error('the key must be a string or buffer, check your code! received ' + typeof key)
    }
}

// Validate and convert byte value to proper format
// All values should be sent as strings, then converted to a buffer internally
proto.BytesValue = function BytesValue(value) {
    if(typeof value === 'string') {
	return new Buffer(value)
    }
    else if(value instanceof Buffer) {
	return value 
    }
    else {
	throw new Error('the value must be a string or buffer, check your code! received ' + typeof value)
    }
}

// Validate and convert byte value to proper format
// Expected values are different from normal values cause we can receive a null
// a null means to expect that the entry does not yet exists
proto.ExpectedValue = function ExpectedValue(value) {
    if(value === null) {
	return new Buffer("")
    }
    else if(typeof value === 'string') {
	return new Buffer(value)
    }
    else if(value instanceof Buffer) {
	return value
    }
    else {
	throw new Error('the value must be a string, null or a buffer, check your code! received ' + typeof value)
    }
}

// Validate integer types
proto.Integer = function Integer(value) {
    if(typeof value !== 'number') {
	throw new Error('expected an integer value and received a ' + typeof value + ', check your code!')
    }

    return value
}

// Simple 'stringSet' pseudo implementation
function stringSet() {
    var table = {}
    for(var i in arguments) {
	table[arguments[i]] = true	
    }
    return table
}

// Exports
module.exports = proto 
