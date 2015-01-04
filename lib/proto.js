// Mini port of the github.com/cockroachdb/cockroach/proto
// Specifically the api.go file
var Proto = {
	// RPC commands (Constants)
	// See: https://github.com/cockroachdb/cockroach/blob/81f95062c69552fdbbb3c1387ae79becdc58eb80/proto/api.go#L86
	//
	// Contains determines whether the KV map contains the specified key.       
	Contains: "Contains",
	// Get fetches the value for a key from the KV map, respecting a
	// possibly historical timestamp. If the timestamp is 0, returns
	// the most recent value.
	Get: "Get",
	// Put sets the value for a key at the specified timestamp. If the
	// timestamp is 0, the value is set with the current time as timestamp.
	Put: "Put",
	// ConditionalPut sets the value for a key if the existing value
	// matches the value specified in the request. Specifying a null value
	// for existing means the value must not yet exist.
	ConditionalPut: "ConditionalPut",
	// Increment increments the value at the specified key. Once called
	// for a key, Put & Get will return errors; only Increment will
	// continue to be a valid command. The value must be deleted before
	// it can be reset using Put.
	Increment: "Increment",
	// Delete removes the value for the specified key.
	Delete: "Delete",
	// DeleteRange removes all values for keys which fall between
	// args.RequestHeader.Key and args.RequestHeader.EndKey, with
	// the latter endpoint excluded.
	DeleteRange: "DeleteRange",
	// Scan fetches the values for all keys which fall between
	// args.RequestHeader.Key and args.RequestHeader.EndKey, with
	// the latter endpoint excluded.
	Scan: "Scan",
	// EndTransaction either commits or aborts an ongoing transaction.
	EndTransaction: "EndTransaction",
	// ReapQueue scans and deletes messages from a recipient message
	// queue. ReapQueueRequest invocations must be part of an extant
	// transaction or they fail. Returns the reaped queue messsages, up to
	// the requested maximum. If fewer than the maximum were returned,
	// then the queue is empty.
	ReapQueue: "ReapQueue",
	// EnqueueUpdate enqueues an update for eventual execution.
	EnqueueUpdate: "EnqueueUpdate",
	// EnqueueMessage enqueues a message for delivery to an inbox.
	EnqueueMessage: "EnqueueMessage",
	// Batch executes a set of commands in parallel.
	Batch: "Batch",
	// AdminSplit is called to coordinate a split of a range.
	AdminSplit: "AdminSplit",
}

// Request returns a basic request object
Proto.Request = function Request() {
	return {
		header: {
			user: 'root',
		}
	}	
}

Proto.GetRequest = function GetRequest(key) {
	var request = Proto.Request()

	request.header.key = Proto.Key(key)

	return request 
}

Proto.IncrementRequest = function IncrementRequest(key, increment) {
	var request = Proto.Request()

	request.header.key = Proto.Key(key)
	request.increment = Proto.Integer(increment)

	return request
}

Proto.PutRequest = function PutRequest(key, value) {
	var request = Proto.Request()

	request.header.key = Proto.Key(key)
	request.value = {
		bytes: Proto.Value(value),
		// TODO: calculate checksum
	}

	return request
}

Proto.ConditionalPutRequest = function ConditionalPutRequest(key, value, expectedValue) {
	var request = Proto.Request()

	request.header.key = Proto.Key(key)
	request.value = {
		bytes: Proto.Value(value),
		// TODO: calculate checksum
	}
	request.exp_value = {
		bytes: Proto.Value(expectedValue),
	}

	return request
}

Proto.DeleteRequest = function DeleteRequest(key) {
	var request = Proto.Request()

	request.header.key = Proto.Key(key)
	
	return request
}

Proto.DeleteRangeRequest = function DeleteRangeRequest(key, endKey, maxEntries) {
	var request = Proto.Request()

	request.header.key = Proto.Key(key)
	request.header.end_key = Proto.Key(endKey)
	request.max_entries_to_delete = Proto.Integer(maxEntries)
	
	return request
}

Proto.ScanRequest = function ScanRequest(key, endKey, maxResults) {
	var request = Proto.Request()

	request.header.key = Proto.Key(key)
	request.header.end_key = Proto.Key(endKey)
	request.max_results = Proto.Integer(maxResults)

	return request
}

Proto.ContainsRequest = function ContainsRequest(key) {
	var request = Proto.Request()

	request.header.key = Proto.Key(key)

	return request
}

// Prepare batch request body
// Encapsulate the request in its correct json propertie
// Ported from https://github.com/cockroachdb/cockroach/blob/master/proto/api.proto#L303
Proto.BatchRequestPrepare = function BatchRequestPrepare(method, request) {
	switch(method) {
		case Proto.Contains:
			return {
				contains: request,
			}
		case Proto.Get:
			return {
				get: request,
			}
		case Proto.Put:
			return {
				put: request,
			}
		case Proto.ConditionalPut:
			return {
				conditional_put: request,
			}
		case Proto.Increment:
			return {
				increment: request,
			}
		case Proto.Delete:
			return {
				'delete': request,
			}
		case Proto.DeleteRange:
			return {
				delete_range: request,
			}
		case Proto.Scan:
			return {
				scan: request,
			}
		case Proto.EndTransaction:
			return {
				end_transaction: request,
			}
		case Proto.ReapQueue:
			return {
				reap_queue: request,
			}
		case Proto.EnqueueUpdate:
			return {
				enqueue_update: request,
			}
		case Proto.EnqueueMessage:
			return {
				enqueue_message: request,
			}
		default:
			return {
				// WHAT?
				// TODO:
			}
	}	
}

// Batch request
Proto.BatchRequest = function BatchRequest(batch) {
	var request = Proto.Request()

	request.requests = []

	for(var i in batch) {
		request.requests[i] = batch[i]	
	}

	return request
}

// Validate and convert key to proper format
Proto.Key = function Key(key) {
	if(typeof key !== 'string') {
		throw new Error('the key must be a string, check your code! received ' + typeof key)
	}

	// Convert to base64, because it's a json obj.
	return base64(key)
}

// Validate and convert byte value to proper format
// All values should be sent as strings, then converted to a buffer internally
Proto.Value = function Value(value) {
	if(typeof value !== 'string') {
		throw new Error('the value must be a string, check your code! received ' + typeof value)
	}

	// Convert to base64, because it's a json obj.
	return base64(value)
}

// Validate integer types
Proto.Integer = function Integer(value) {
	if(typeof value !== 'number') {
		throw new Error('expected an integer value and received a ' + typeof value + ', check your code!')
	}

	return value
}


// Internal helper function, to base64 value
function base64(value) {
	return new Buffer(value).toString('base64')
}


// Exports
module.exports = Proto
