// Meta object inititiation
// See docs
function Meta() {}

// Number of flushed queries, if it was a .Flush request
Meta.prototype.flush = 0

// Reference to the actual response object received from cockroach 
Meta.prototype.res = null 

// Exports
module.exports = Meta 
