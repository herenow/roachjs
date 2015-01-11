var retry = require('./retry.js')

exports.testRetry = function(test) {
	var opts = {
		tag: "test",
		backoff: 0.001, // 1 microsecond
		maxBackoff: 1000.0, // 1 second
		constant: 2.0,
		maxAttempts: 10
	}
	var retries = 0 
	retry.WithBackoff(opts, function retryFnc(callback) {
		retries++
		if(retries >= 3) {
			callback(null, retry.Break)
			return
		}
		callback(null, retry.Continue)
	}, function finish(err) {
		test.ifError(err)
		test.equal(retries, 3, '# of retries did not match expected value')
		test.done()
	})
}

exports.testRetryExceedsMaxBackoff = function(test) {
	setTimeout(function() {
		test.ok(false, 'max backoff not respected')	
	}, 1000)

	var opts = {
		tag: "test",
		backoff: 0.001,
		maxBackoff: 0.01,
		constant: 1000,
		maxAttempts: 3,
	}

	retry.WithBackoff(opts, function(callback) {
		callback(null, retry.Continue)	
	}, function finish(err) {
		if(! err instanceof retry.MaxAttemptsError) {
			test.ok(false, 'should have receive max attempts error on retry')
		}
		test.done()
	}) 
}

exports.testRetryExceedsMaxAttempts = function(test) {
	var retries = 0
	var opts = {
		tag: "test",
		backoff: 0.01,
		maxBackoff: 1.0,
		constant: 2,
		maxAttempts: 3,
	}
	retry.WithBackoff(opts, function(callback) { 
		retries++
		callback(null, retry.Continue)
	}, function finish(err) {
		if(! err instanceof retry.MaxAttemptsError) {
			test.ok(false, "should receive max attempts error on retry")
		}
		test.equal(retries, 3, "expected 3 retries, got " + retries)
		test.done()
	})
}

exports.testRetryFunctionReturnsError = function(test) {
	var opts = {
		tag: "test",
		backoff: 0.01,
		maxBackoff: 1.0,
		constant: 2,
		maxAttempts: 0,
	}
	retry.WithBackoff(opts, function(callback) {
		callback(new Error('something went wrong'), retry.Break)
	}, function finish(err) {
		if(! err) {
			test.ok(false, 'expected an error')
		}
		test.done()
	})
}

exports.testRetryReset = function(test) {
	var opts = {
		tag: "test",
		backoff: 0.01,
		maxBackoff: 1.0,
		constant: 2,
		maxAttempts: 1,
	}
	var count  = 0
	// Backoff loop has 1 allowed retry; we always return RetryReset, so
	// just make sure we get to 2 retries and then break.
	retry.WithBackoff(opts, function(callback) {
		count++
		if(count == 2) {
			callback(null, retry.Break)
			return
		}
		callback(null, retry.Reset)
	}, function finish(err) {
		test.ifError(err)
		test.equal(count, 2, 'expected 2 retries; got ' + count)
		test.done()
	}) 
}
