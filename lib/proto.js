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

// Basic request body 
Proto.Request = function Request() {
	return this
}

// Request header
Proto.Request.prototype.header = {
	user: 'root',
}

// Header acessor
Proto.Request.prototype.Header = function() {
	return this.header
}

// Basic response body
Proto.Response = function Response(res) {
	if(res.header.error) {
		this.error = res.header.error
	}
	if(res.header.timestamp) {
		this.timestamp = res.header.timestamp
	}
	if(res.header.txn) {
		this.txn = res.header.txn
	}
	return this
}

// Response header
Proto.Response.prototype.header = {
	// Error is non-nil if an error occurred.                                              
	error: null,	
	// Timestamp specifies time at which read or write actually was
	// performed. In the case of both reads and writes, if the timestamp
	// supplied to the request was 0, the wall time of the node
	// servicing the request will be set here. Additionally, in the case
	// of writes, this value may be increased from the timestamp passed
	// with the RequestHeader if the key being written was either read
	// or written more recently.
	timestamp: 0,	
	// Transaction is non-nil if the request specified a non-nil
	// transaction. The transaction timestamp and/or priority may have
	// been updated, depending on the outcome of the request.
	txn: null,	
}

// Header acessor
Proto.Response.prototype.Header = function() {
	return this.header
}

Proto.GetRequest = function GetRequest(key) {
	var request = new Proto.Request()

	request.header.key = Proto.Key(key)

	return request 
}

Proto.GetResponse = function GetResponse(res) {
	var response = new Proto.Response(res)

	if(response.error) {
		return response
	}

	response.value = fromBase64(res.value.bytes)

	return response	
}

Proto.IncrementRequest = function IncrementRequest(key, increment) {
	var request = new Proto.Request()

	request.header.key = Proto.Key(key)
	request.increment = Proto.Integer(increment)

	return request
}

Proto.IncrementResponse = function IncrementResponse(res) {
	var response = new Proto.Response(res)

	response.new_value = res.new_value 

	return response	
}


Proto.PutRequest = function PutRequest(key, value) {
	var request = new Proto.Request()

	request.header.key = Proto.Key(key)
	request.value = {
		bytes: Proto.Value(value),
		// TODO: calculate checksum
	}

	return request
}

Proto.PutResponse = function PutResponse(res) {
	var response = new Proto.Response(res)

	return response	
}

Proto.ConditionalPutRequest = function ConditionalPutRequest(key, value, expectedValue) {
	var request = new Proto.Request()

	request.header.key = Proto.Key(key)
	request.value = {
		bytes: Proto.Value(value),
		// TODO: calculate checksum
	}
	request.exp_value = {
		bytes: Proto.ExpectedValue(expectedValue),
	}

	return request
}

Proto.ConditionalPutResponse = function ConditionalPutResponse(res) {
	var response = new Proto.Response(res)

	if(res.actual_value) {
		response.actual_value = fromBase64(res.actual_value.bytes)
	}

	return response	
}

Proto.DeleteRequest = function DeleteRequest(key) {
	var request = new Proto.Request()

	request.header.key = Proto.Key(key)
	
	return request
}

Proto.DeleteResponse = function DeleteResponse(res) {
	var response = new Proto.Response(res)

	return response	
}

Proto.DeleteRangeRequest = function DeleteRangeRequest(key, endKey, maxEntries) {
	var request = new Proto.Request()

	request.header.key = Proto.Key(key)
	request.header.end_key = Proto.Key(endKey)
	request.max_entries_to_delete = Proto.Integer(maxEntries)
	
	return request
}

Proto.DeleteRangeResponse = function DeleteRangeResponse(res) {
	var response = new Proto.Response(res)

	response.num_deleted = res.num_deleted

	return response
}

Proto.ScanRequest = function ScanRequest(key, endKey, maxResults) {
	var request = new Proto.Request()

	request.header.key = Proto.Key(key)
	request.header.end_key = Proto.Key(endKey)
	request.max_results = Proto.Integer(maxResults)

	return request
}

Proto.ScanResponse = function ScanResponse(res) {
	var response = new Proto.Response(res)

	if(!res.rows || res.rows.length === 0) {
		return responses
	} 	

	response.rows = []

	for(var i in res.rows) {
		var row = res.rows[i]

		response.rows.push({
			key: fromBase64(row.key),
			value: fromBase64(row.value),
		})
	}

	return response
}

Proto.ContainsRequest = function ContainsRequest(key) {
	var request = new Proto.Request()

	request.header.key = Proto.Key(key)

	return request
}

Proto.ContainsResponse = function ContainsResponse(res) {
	var response = new Proto.Response(res)

	response.exists = res.exists 

	return response
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

// Prepare the batch response for each individual response
// This method parses the response to its apropiate method response
Proto.BatchResponsePrepare = function BatchResponsePrepare(method, res) {
		switch(method) {
		case Proto.Contains:
			return Proto.ContainsResponse(res) 
		case Proto.Get:
			return Proto.GetResponse(res)
		case Proto.Put:
			return Proto.PutResponse(res)
		case Proto.ConditionalPut:
			return Proto.ConditionalPutResponse(res)
		case Proto.Increment:
			return Proto.IncrementResponse(res)
		case Proto.Delete:
			return Proto.DeleteResponse(res)
		case Proto.DeleteRange:
			return Proto.DeleteRangeResponse(res)
		case Proto.Scan:
			return Proto.ScanResponse(res)
		case Proto.EndTransaction:
		case Proto.ReapQueue:
		case Proto.EnqueueUpdate:
		case Proto.EnqueueMessage:
		default:
			// TODO:
			// What behavior should we do?
			var response = new Proto.Response({
				header: {
					error: 'unable to parse response'
				}
			})
			return response 
	}	
} 

// Batch request
Proto.BatchRequest = function BatchRequest(batch) {
	var request = new Proto.Request()

	request.requests = []

	for(var i in batch) {
		request.requests[i] = batch[i]	
	}

	return request
}

Proto.BatchResponse = function BatchResponse(res) {
	var response = new Proto.Response(res)

	if(response.error) {
		return response
	}

	if(!res.responses || res.responses.length === 0) {
		return responses
	}

	response.responses = []

	for(var i in res.responses) {
		var row = res.responses[i]
		var method = Object.keys(row)[0]
		var rowRes = Proto.BatchResponsePrepare(method, row[method])

		response.responses.push(rowRes)
	}
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

// Validate and convert byte value to proper format
// Expected values are different from normal values cause we can receive a null
// a null means to expect that the entry does not yet exists
Proto.ExpectedValue = function ExpectedValue(value) {
	if(value === null) {
		// Return empty base64
		return ""	
	}
	else if(typeof value !== 'string') {
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

// Decode from base64
function fromBase64(value) {
	return new Buffer(value, 'base64').toString('utf8')	
}

// Exports
module.exports = Proto
