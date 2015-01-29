// Retry interface
var Retry = {}

// retryJitter specifies random jitter to add to backoff
// durations. Specified as a percentage of the backoff.
var retryJitter = 0.15

// RetryMaxAttemptsError indicates max attempts were exceeded.
var RetryMaxAttemptsError = Retry.MaxAttemptsError = function RetryMaxAttemptsError() {}

// RetryBreak indicates the retry loop is finished and should return
// the result of the retry worker function.
var RetryBreak = Retry.Break = 0 
// RetryReset indicates that the retry loop should be reset with
// no backoff for an immediate retry.
var RetryReset = Retry.Reset = 1
// RetryContinue indicates that the retry loop should continue with
// another iteration of backoff / retry.
var RetryContinue = Retry.Continue = 2

// RetryOptions provides control of retry loop logic via the
// RetryWithBackoffOptions method.
var RetryOptions = Retry.Options = function RetryOptions(opts) { 
    // Tag for helpful logging of backoffs
    this.tag         = opts.tag || '' 
    // Default retry backoff interval
    this.backoff     = opts.backoff || 0
    // Maximum retry backoff interval
    this.maxBackoff  = opts.maxBackoff || 0
    // Default backoff constant
    this.constant    = opts.constant|| 0
    // Maximum number of attempts (0 for infinite)
    this.maxAttempts = opts.maxAttempts || 0 
}

// RetryWithBackoff implements retry with exponential backoff using
// the supplied options as parameters. When fn returns RetryContinue
// and the number of retry attempts haven't been exhausted, fn is
// retried. When fn returns RetryBreak, retry ends. As a special case,
// if fn returns RetryReset, the backoff and retry count are reset to
// starting values and the next retry occurs immediately. Returns an
// error if the maximum number of retries is exceeded or if the fn
// returns an error.
Retry.WithBackoff = function RetryWithBackoff(options, retryFnc, callback) {
    var opts = new RetryOptions(options)
    var backoff = opts.backoff
    var count = 0

    var loop = function loop() {
        var _executed = false
        count++

        retryFnc(function retryReturn(err, _status) {
            if(_executed === true) {
                throw new Error('the retry function called callback() twice, check your code!')
            }

            _executed = true

            if(_status === RetryBreak) {
                callback(err)
                return
            }   
            
            var wait = 0 

            if(_status === RetryReset) {
                backoff = opts.backoff
                wait = 0
                count = 0
            } else {
                if(opts.maxAttempts > 0 && count >= opts.maxAttempts) {
                    callback(new RetryMaxAttemptsError())
                    return
                }

                //wait = backoff + time.Duration(rand.Float64()*float64(backoff.Nanoseconds())*retryJitter)
                //console.log('wait', wait, 'backoff', backoff, 'backoff.nano', (backoff / 1000))
                wait = (backoff + Math.random() * backoff * retryJitter)
                //console.log('wait', wait, 'backoff', backoff)
                // Increase backoff for next iteration.
                backoff = (backoff * opts.constant)
                //console.log('backoff', backoff)
                if(backoff > opts.maxBackoff) {
                    backoff = opts.maxBackoff
                }
            }

            // Wait before retry.
            setTimeout(loop, wait)
        })
    }()
}

// Exports
module.exports = Retry
