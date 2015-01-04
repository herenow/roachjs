// Response is a nifty trick to replace callbacks
// When using the prepare pattern
function Response() {
	this.err = null // err callback argument
	this.res = null // res callback argument
	return this
}

// Exports
module.exports = Response
