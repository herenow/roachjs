var retry = require('./retry.js')
var Opts = function() {
    return {
        tag: "test",
        backoff: 50, // 50 ms
        maxBackoff: 1000, // 1 seconds
        constant: 1.0,
        maxAttempts: 10
    }
}

exports.testRetry = function(test) {
    var opts = Opts()
    var retries = 0

    opts.maxAttempts = 3

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

    var opts = Opts()

    opts.maxBackoff = 90

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
    var opts = Opts()

    opts.maxAttempts = 3

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
    var opts = Opts()

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
    var opts = Opts()
    var count  = 0

    opts.maxAttempts = 1

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

exports.testCallbackTwiceShouldFail = function(test) {
    var opts = Opts()
    var retries = 0

    test.throws(function() {
        retry.WithBackoff(opts, function retryFnc(callback) {
            retries++
            callback(null, retry.Break)
            callback(null, retry.Continue)
        }, function finish(err) {})
    })
    test.done()
}
