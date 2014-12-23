// Dependencies
var url = require('url')
var pjson = require('../package.json')

// DB api endpoint
var _endpoint = '/kv/db'

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

// Default constructor opts
var _defaultOpts = {
	uri: 'http://127.0.0.1:8080/',
	http: require('http'), // for mocking
}

// Construct a requester
function Requester(opts) {
	// Default opts
	if(typeof opts === 'undefined') {
		opts =  _defaultOpts
	}

	for(var p in _defaultOpts) {
		if(typeof opts[p] === 'undefined') {
			opts[p] = _defaultOpts[p]
		}	
	}
	
	// Default  retry opts
	if(typeof opts.retry === 'undefined') {
		opts.retry = _defaultRetryOpts
	}

	for(var p in _defaultRetryOpts) {
		if(typeof opts.retry[p] === 'undefined') {
			opts.retry[p] = _defaultRetryOpts[p]
		}
	}

	// Parse uri (dsn)
	var uri = url.parse(opts.uri)

	// Requester properties
	this.retry = opts.retry
	this.http = opts.http
	this.host = uri.host
	this.port = uri.port || 80

	return this
}

// Send post request to endpoint
Requester.prototype.Call= function CallEndpoint(args) {
	var cb = function EndpointResponse = function(res) {
		
	}

	var opts = {
		host: this.host,
		port: this.port,
		path: _endpoint,
		headers: {
			'User-Agent': _userAgent,
			'Content-Type': 'application/x-protobuf',
			'Accept': 'application/x-protobuf',
		}
	}

	var data = kkk

	var req = this.http.request(opts, cb)	

	req.write(data)
	req.end()
}

// Exports
module.exports = Requester
