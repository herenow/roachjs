var Roach = require('../index.js')

var client = new Roach({
    uri: 'http://localhost:8080'
})

var opts = {
    name: "transaction example",
}

var errNoApples = new Error('Insufficient apples!')

var transaction = function(txn, commit, abort) {
    txn.get("applesInStock", function(err, value) {
        if(err) {
            return abort(err)
        }

        var dispatch = 5
        var inStock = parseInt(value.toString())

        if(inStock < dispatch) {
            return abort(errNoApples)
        }

        txn.increment("applesInStock", -dispatch)
        txn.increment("applesInRoute", +dispatch)

        // Commit automatically flushes
        commit()
    })
}

client.runTransaction(opts, transaction, function(err, res) {
    if(err === errNoApples) {
        // Alert user there are no more apples...
         console.log('errNoApples')
    }
    else if(err) {
        // Transaction failed...
        console.log('Transaction failed...')
        throw err
    }
    else {
        // Transaction commited...
        console.log('Transaction commited...')
    }
})
