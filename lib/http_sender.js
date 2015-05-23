// Dependencies
var url = require('url')
var proto = require('./proto.js')
var retry = require('./retry.js')
var pjson = require('../package.json')

// KVDBEndpoint is the URL path prefix which accepts incoming
// HTTP requests for the KV API.
var KVDBEndpoint = "/kv/db/"
// KVDBScheme is the scheme for connecting to the kvdb endpoint.
// TODO(spencer): change this to CONSTANT https. We shouldn't be
// supporting http here at all.
var KVDBScheme = "http"
// StatusTooManyRequests indicates client should retry due to
// server having too many requests.
var StatusTooManyRequests = 429
// User-agent
var UserAgent = 'RoachJS v' + pjson.version

// httpSendError wraps any error returned when sending an HTTP request
// in order to signal the retry loop that it should backoff and retry.
var HttpSendError = HTTPSender.SendError = function SendError(err) {
    this.__proto__ = err
}
HttpSendError.prototype = new Error()

// HTTPRetryOptions sets the retry options for handling retryable
// HTTP errors and connection I/O errors.
var HTTPRetryOptions = {
    backoff:     50, // ms
    maxBackoff:  5 * 1000,
    constant:    2,
    maxAttempts: 0, // retry indefinitely
}

// HTTPSender is an implementation of KVSender which exposes the
// Key-Value database provided by a Cockroach cluster by connecting
// via HTTP to a Cockroach node. Overly-busy nodes will redirect
// this client to other nodes.
function HTTPSender(opts) {
    if(opts.host && opts.port) {
        this.host = opts.host
        this.port = opts.port
    }
    else if(opts.uri) {
        var uri = url.parse(opts.uri)

        this.host = uri.hostname
        this.port = uri.port || 80

        // TODO: remove opts.host and opts.port and depend only on the
        // uri. This will remove complexity when deciding between between
        // ssl and unencrypted. I'm waiting for CockroachDB stable release.
        if(uri.protocol === 'http' && opts.http === require('https')) {
            // Downgrade to http, respect the uri
            opts.http = require('http')
        }
    }
    else {
        throw new Error('failed to create http_sender, no endpoint was specified.')
    }

    this.http   = opts.http || require('https') // CockroachDB advocates HTTPS, and it's right!

    this.agent  = opts.agent || false // If opts.agent == false, we should respect that, altough null or undefined would also be defaulted to false in this case.
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
    retryOpts.tag = "http " + call.Method

    var self = this
    var response;

    retry.WithBackoff(retryOpts, function RetryFunction(retryCallback) {
        self.post(call, function(err, res) {
            response = res // update response
            if(err) {
                if(res) {
                    switch(res.statusCode) {
                        // Retry on service unavailable and request timeout.
                        // TODO(spencer): consider respecting the Retry-After header for
                        // backoff / retry duration.
                        case 503: // StatusServiceUnavailable
                        case 504: // StatusGatewayTimeout
                        case StatusTooManyRequests: // Custom code
                            retryCallback(null, retry.Continue)
                            break;
                        // Can't recover from all other errors.
                        default:
                            retryCallback(err, retry.Break)
                    }
                }
                else {
                    // TODO:
                    // There might be some retryable errors
                    retryCallback(err, retry.Break)
                }
                return
            }

            // On successful post, we're done with retry loop.
            retryCallback(err, retry.Break)
        })
    }, function Finish(err) {
        callback(err, response)
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
        agent: this.agent,
        headers: {
            'User-Agent': UserAgent,
            'Content-Type': 'application/x-protobuf',
            'Accept': 'application/x-protobuf',
        }
    }

    var body = call.Request.toBuffer()

    var req = this.http.request(opts, function(res) {
        if(res.statusCode !== 200) {
            callback(
                new Error('received status code '+res.statusCode+' from kv db endpoint.')
            )
            return
        }

        res.setEncoding('base64')

        var data = ''

        res.on('data', function(chunk) {
            data += chunk
        })

        res.on('end', function() {
            try {
                var builder = proto.GetResponseBuilder(call.Method)
                var response = builder.decode(data, 'base64')
            } catch(e) {
                callback(
                    new Error('failed to parse response from kv db endpoint ('+e.message+')'),
                    null
                )
                throw e
                return
            }

            callback(null, response)
        })
    })

        req.on('error', function(err) {
            callback(new HttpSendError(err))
        })

    req.write(body)
    req.end()
}

// Exports
module.exports = HTTPSender
