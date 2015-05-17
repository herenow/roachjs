'use strict'

var retry = require('./retry')
var proto = require('./proto')

module.exports = function CockroachError(message, header) {
    // We're intentionally NOT capturing a stack here for two reasons:
    // * This error occurs routinely due to database contention, so there may be
    //   some non-negligible performance impact
    // * This is a remote error, so the local stack trace is irrelevant anyways
    //Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
    this.stack = this.name + ': ' + this.message +
      '\n     remote error, no stacktrace'
    this.header = header
}

require('util').inherits(module.exports, Error)

module.exports.prototype.canRestart = function () {
    return this.header.error.transaction_restart !== proto.ABORT
}

module.exports.prototype.getRestartPolicy = function () {
    return this.header.error.transaction_restart === proto.BACKOFF ?
      retry.Continue :
      retry.Reset
}
