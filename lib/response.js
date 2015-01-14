// Response is a nifty trick to replace callbacks
// When using the prepare pattern
function Response() {}

// Err argument from callback
Response.prototype.err = null

// Meta argument from callback
Response.prototype.res = null

// Exports
module.exports = Response
