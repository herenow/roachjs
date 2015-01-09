//const (
	// KVDBEndpoint is the URL path prefix which accepts incoming
	// HTTP requests for the KV API.
var	KVDBEndpoint = "/kv/db/"
	// KVDBScheme is the scheme for connecting to the kvdb endpoint.
	// TODO(spencer): change this to CONSTANT https. We shouldn't be
	// supporting http here at all.
var	KVDBScheme = "http"
	// StatusTooManyRequests indicates client should retry due to
	// server having too many requests.
var StatusTooManyRequests = 429
//)

// httpSendError wraps any error returned when sending an HTTP request
// in order to signal the retry loop that it should backoff and retry.
var httpSendError = {
	error: {}
}

// HTTPRetryOptions sets the retry options for handling retryable
// HTTP errors and connection I/O errors.
var HTTPRetryOptions = new util.RetryOptions({
	Backoff:     50, // ms
	MaxBackoff:  5 * 1000,
	Constant:    2,
	MaxAttempts: 0, // retry indefinitely
})

// HTTPSender is an implementation of KVSender which exposes the
// Key-Value database provided by a Cockroach cluster by connecting
// via HTTP to a Cockroach node. Overly-busy nodes will redirect
// this client to other nodes.
function HTTPSender(opts) { 
	this.server = opts.server || '' // The host:port address of the Cockroach gateway node
	this.client = opts.client || require('http') // The HTTP client
}

// NewHTTPSender returns a new instance of HTTPSender.
// @server {string}
// @transport {http.Transportr}
function NewHTTPSender(server, http) *HTTPSender {
	return new HTTPSender({
		server: server,
		client: http, 
	})
}

// Send sends call to Cockroach via an HTTP post. HTTP response codes
// which are retryable are retried with backoff in a loop using the
// default retry options. Other errors sending HTTP request are
// retried indefinitely using the same client command ID to avoid
// reporting failure when in fact the command may have gone through
// and been executed successfully. We retry here to eventually get
// through with the same client command ID and be given the cached
// response.
// func (s *HTTPSender) Send(call *Call) {
HTTPSender.prototype.Send = function Send(call, callback) {
	var retryOpts = HTTPRetryOptions
	retryOpts.Tag = "http " + call.Method

	var self = this

	retry.RetryWithBackoff(retryOpts, function RetryFunction(retry) {
		self.post(call, function(err, res) {
			if(err) {
				if(res) {
					switch(res.statusCode) {
						// Retry on service unavailable and request timeout.
						// TODO(spencer): consider respecting the Retry-After header for
						// backoff / retry duration.
						case StatusServiceUnavailable:
						case StatusGatewayTimeout:
						case StatusTooManyRequests:
							retry(util.RetryContinue, null)
							break;
						// Can't recover from all other errors.
						default:	
							retry(util.RetryBreak, err)
					}
				}
				else {
					// TODO:
					// There might be some retryable errors
					retry(util.RetryBreak, err)
				}
				return
			}

			// On successful post, we're done with retry loop.
			retry(util.RetryBreak, null)
		})		
	}, function Finish(err) {
		callback(err)
	})
}

// Close implements the KVSender interface.
HTTPSender.prototype.Close =  function Close() {
}

// post posts the call using the HTTP client. The call's method is
// appended to KVDBEndpoint and set as the URL path. The call's arguments
// are protobuf-serialized and written as the POST body. The content
// type is set to application/x-protobuf.
//
// On success, the response body is unmarshalled into call.Reply.
HTTPSender.prototype.post = function(call, callback) {
	var opts = {
		method: 'POST',
		path: KVDBEndpoint + call.Method,
		host: this.host,
		port: this.port,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		}
	}

	var body = JSON.stringify(call.Args)

	var req = this.client.request(opts, function(res) {
		if(res.statusCode !== 200) {
			callback(
				new Error('received status code '+res.statusCode+' from kv db endpoint.'),
				res	
			)
			return
		}

		var data = ''

		res.on('data', function(chunk) {
			data += chunk
		})

		res.on('end', function() {
			try {
				call.Reply = JSON.parse(data)
			} catch(e) {
				callback(
					new Error('failed to parse response data from kv db endpoint.'),
					null
				)
				return
			}

			callback(null, res)
		})
	})

	req.on('error', callback)
	
	req.write(body)
	req.end()
}

// Exports
module.exports = {}
