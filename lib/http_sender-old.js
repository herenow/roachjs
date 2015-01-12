// Dependencies
var url = require('url')
var pjson = require('../package.json')

// DB api endpoint
var _endpoint = '/kv/db/'

// User-agent
var _userAgent = 'RoachJS v' + pjson.version

// DB busy, retry status code
var _statusToManyRequest = 423

// Request retry options
var _defaultRetryOpts = {
	wait: 50, //ms
	maxWait: 5000,
	incrWaitConst: 2,
	maxRetry: 0, // infinite
}

// Construct a requester
function Requester(opts) {
	if(opts.host && opts.port) {
		this.host = opts.host
		this.port = opts.port
	}
	else if(opts.uri) {
		var uri = url.parse(opts.uri)	

		this.host = uri.hostname
		this.port = uri.port || 80
	}
	else {
		throw new Error('failed to create http_sender, no endpoint was specified.')
	}

	// Requester properties
	this.retry = opts.retry || true
	this.http = opts.http || require('http')
	this.user = opts.user || 'root'

	return this
}

// Send post request to endpoint
Requester.prototype.Send = function Send(method, request, callback) {
	// Read https://github.com/cockroachdb/cockroach/blob/81f95062c69552fdbbb3c1387ae79becdc58eb80/proto/api.go#L86
	// For a list of possible methods
	var url = _endpoint + method

	var opts = {
		host: this.host,
		port: this.port,
		path: url,
		method: 'POST',
		headers: {
			'User-Agent': _userAgent,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		}
	}

	// Set the user
	request.user = this.user

	var data = JSON.stringify(request)

	var req = this.http.request(opts, function EndpointResponse(res) {
		var data = ''

		res.on('data', function(chunk) {
			data += chunk
		})

		res.on('end', function() {
			var resp;

			try {
				resp = JSON.parse(data)
			} catch(e) {
				callback(e, null)
				return
			}

			callback(null, resp)
		})
	})

	req.write(data)
	req.end()
}

// Close connection method (abstract)
Requester.prototype.Close = function Close() {
	return
}


// Exports
module.exports = Requester
