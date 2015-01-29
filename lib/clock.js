// Specification on how to implement a clock interface
// Useful if you want to sync your clocks with some
// higher precision clock
var Clock = {}

// Try to use the microtime module if available
try {
    var microtime = require('microtime')
} catch(e) {
    microtime = null
}

// Implement the .now() interface
// This should return an int with the time in nanoseconds
if(microtime) {
    Clock.now = function microtimeNow() {
        return microtime.now() * 1000 // microseconds to nano 
    }
}
else {
    Clock.now = function newDateNow() {
        return new Date().getTime() * 1000000 // milliseconds to nano
    }
}

// Exports
module.exports = Clock
