# RoachJS - CockroachDB Driver

[![NPM](https://nodei.co/npm/roachjs.png?downloads=true&stars=true)](https://nodei.co/npm/roachjs/)

[![Build Status](https://travis-ci.org/herenow/roachjs.svg?branch=master)](https://travis-ci.org/herenow/roachjs)

* [Introduction](#introduction)
* [Installation](#installation)
* [Documentation](#documentation)
* [CockroachDB](https://github.com/cockroachdb/cockroach)

## <a name="introduction"></a>Introduction

This client is a port from the original [Golang client](http://godoc.org/github.com/cockroachdb/cockroach/client).
Internally it's is more or less the same, but this driver provides a friendlier javascript interface.

## <a name="installation"></a> Installation

```bash
$ npm install roachjs
```

## <a name="documentation"></a> Documentation

* [Examples](#examples)
    * [Initiating a client](#example-init-client)
    * [Basic client usage I](#example-basic-1)
    * [Advanced client usage I (Prepare & Flush)](#example-advanced-1)
    * [Advanced client usage II (Transactions)](#example-advanced-2)
* [Interface](#interface)
    * [new Client(opts)](#client)
        * [.get(key, callback)](#client-get)
        * [.put(key, value, callback)](#client-put)
        * [.conditionalPut(key, value, ifValue, callback)](#client-conditionalPut)
        * [.increment(key, increment, callback)](#client-increment)
        * [.contains(key, callback)](#client-contains)
        * [.scan(start_key, end_key, limit, callback)](#client-scan)
        * [.delete(key, callback)](#client-delete)
        * [.deleteRange(start_key, end_key, limit, callback)](#client-deleteRange)
        * [.prepare()](#client-prepare)
            * [.flush(callback)](#prep-client-flush)
        * [.runTransaction(opts, transaction, callback)](#client-runTransaction)
* [Extra](#extra)
    * [Response properties](#res-structure)
    * [Transaction function](#retryable-function)
    * [Compiling .proto files](#compile-proto-files)

## <a name="examples"></a>Examples

### <a name="example-init-client"></a> Initiating a client
```javascript
var Roach = require('roachjs')

var client = new Roach({
    uri: 'http://127.0.0.1:8080'
})

module.exports = client
```

### <a name="example-basic-1"></a> Basic client usage I
```javascript
client.get("sample_key", function(err, value, res) {
    if(err) throw err

    client.put("other_key", value, function(err, res) {
        if(err) {
            // Failed
        }
        else {
            // Sucess
        }
    })
})
```

### <a name="example-advanced-1"></a> Advanced client usage I (Prepare & Flush)
```javascript
// You should prepare your queries and send them in a single batch
// For optimal performance
var c = client.prepare()

// This callback will be the first to be executed
c.get("sample_key", function(err, value, res) {
    if(err) throw err

    // Do something...
})

c.get("sample_key2", function(err, value, res) {
    if(err) throw err

    // Do something...
})

c.put("some_key", "some_value", function(err) {
    if(err) throw err

    // Do something
})

// The flush callback is the last one to be called
c.flush(function(err, res) {
    if(err) throw err

    console.log('Sucessfuly flushed %d queries.', res.responses.length)
})
```

### <a name="example-advanced-2"></a> Advanced client usage II (Transactions)
```javascript
var opts = {
    name: "transaction example",
}

var errNoApples = new Error('Insufficient apples!')

var transaction = function(txn, commit, abort) {
    txn.get("applesInStock", function(err, value, res) {
        if(err || applesInStock.err) {
                return abort(err)
            }

            var dispatch = 5
            var inStock = parseInt(applesInStock.value)

            if(inStock < dispatch) {
                return abort(errNoApples)
        }

        // Upgrade for a prepared client
        txn = txn.prepare()

        txn.increment("applesInStock", -dispatch)
        txn.increment("applesInRoute", +dispatch)

        // Commit automatically flushes
        commit()
    })
}

client.runTransaction(opts, transaction, function(err, res) {
    if(err === errNoApples) {
        // Alert user there are no more apples...
    }
    else if(err) {
        // Transaction failed...
    }
    else {
        // Transaction commited...
    }
})
```

## <a name="interface"></a> Interface

### <a name="client"></a> new Client(opts)

Returns a new roachjs client with [options](#client-options).

##### Parameters

name | type | description
--- | --- | ----
`opts` | object | [see](#client-options)

##### <a name="client-options"></a> Client options

opt | description | default
--- | --- | ---
`uri` | uri to the cockroach http endpoint | `http://127.0.0.1:8080/`
`host` | host or ip to the cockroach http endpoint | `127.0.0.1`
`port` | port to the cockroach http endpoint | `8080`
`ssl` | connect throught https | `false`
`user` | user to run the requests with | `root`
`retry` | retry requests when cockroach responds with a busy signal | `true`
`http` | http module to use | `require('http')`
`sockets` | maximum number of sockets to open on the http connection pool ([read more](https://nodejs.org/api/http.html#http_class_http_agent)) | `5`
`clock` | clock module to use | `new Date()`

##### <a name="client-methods"></a> Methods

| method |
| --- |
| [get](#client-get) |
| [put](#client-put) |
| [conditionalPut](#client-conditionalPut) |
| [contains](#client-contains) |
| [increment](#client-increment) |
| [scan](#client-scan) |
| [delete](#client-delete) |
| [deleteRange](#client-deleteRange) |
| [prepare](#client-prepare) |
| [runTransaction](#client-runTransaction) |

### <a name="client-get"></a> client.get(key, callback)

Gets a single entry from the datastore, specified by `key`.

##### Parameters

name | type | description
--- | --- | ----
`key` | string |  
`callback` | callback | `function(err, value, res) {}`

##### Callback

name | type | description
--- | --- | ----
`err` | Error() |  
`value` | Buffer |  
`res` | object | [see](#res-struct)

##### Example
```javascript
client.get("key", function(err, value, res) {})
```

### <a name="client-put"></a> client.put(key, value, callback)

Puts a value in the datastore in the specified `key`. Ideally you
should send in buffers, but you can pass a string, preferably an utf-8 encoded string.

##### Parameters

name | type | description
--- | --- | ----
`key` | string |
`value` | Buffer, string |
`callback` | callback | `function(err, res) {}`

##### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`res` | object | [see](#res-struct)

##### Example
```javascript
client.put("key", "value", function(err, res) {})
```

### <a name="client-conditionalPut"></a> client.conditionalPut(key, value, ifValue, callback)

ConditionalPut sets the `value` for a `key` if the existing value matches the `ifValue`.
Specifying an empty or null `ifValue` means the entry must not yet exist.

##### Parameters

name | type | description
--- | --- | ----
`key` | string |
`value` | Buffer, string |
`ifValue` | Buffer, string, null | use `null` to put if entry doens't exists  
`callback` | callback | `function(err, res) {}`

##### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`actualValue` | Buffer | If conditional put fails this value is set
`res` | object | [see](#res-struct)

##### Example
```javascript
client.conditionalPut("status", "running", "stopped", function(err, actualValue, res) {})
client.conditionalPut("status", "new", null, function(err, actualValue, res) {})
```

### <a name="client-contains"></a> client.contains(key, callback)

Contains determines if a `key` exists in the datastore.

##### Parameters

name | type | description
--- | --- | ----
`key` | string |
`callback` | callback | `function(err, exists, res) {}`

##### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`exists` | boolean |
`res` | object | [see](#res-struct)

##### Example
```javascript
client.contains("john", function(err, exists, res) {
    if(exists === true) {
        // john exists in the datastore
    }
})
```

### <a name="client-increment"></a> client.increment(key, increment, callback)

Increment increments the value at the specified `key` by some `increment` value.
Once called for a `key`, Put & Get will return errors; only Increment will continue to be a valid command.
The value must be deleted before it can be reset using Put.

##### Parameters

name | type | description
--- | --- | ----
`key` | string |
`increment` | integer |
`callback` | callback | `function(err, newValue, res) {}`

##### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`newValue` | integer |  the new value for this counter, after the increment operation
`res` | object | [see](#res-struct)

##### Example
```javascript
client.increment("counter", 5, function(err, newValue, res) {
    console.log('counter current value is', newValue)
})
```

### <a name="client-scan"></a> client.scan(start_key, end_key, limit, callback)

Scan the datastore for keys in the range of the `start_key` and `end_key`, limiting the result by `limit`.

##### Parameters

name | type | description
--- | --- | ----
`key` | string |
`start_key` | string |
`end_key` | string |
`limit` | integer |
`callback` | callback | `function(err, rows, res) {}`

##### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`rows` | array |
`res` | object | [see](#res-struct)

##### Example
```javascript
client.scan("a", "Z", 100, function(err, rows, res) {
    for(row as rows) {
        console.log(row)
    }
})
```

### <a name="client-delete"></a> client.delete(key, callback)

Delete an entry from the datastore specified by `key`.

##### Parameters

name | type | description
--- | --- | ----
`key` | string |
`callback` | callback | `function(err, res) {}`

##### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`res` | object | [see](#res-struct)

##### Example
```javascript
client.delete("key", function(err, res) {})
```

### <a name="client-deleteRange"></a> client.deleteRange(start_key, end_key, limit, callback)

Delete all keys found in a range, from `start_key` to `end_key`, limited by `limit`.

##### Parameters

name | type | description
--- | --- | ----
`key` | string |
`start_key` | string |
`end_key` | string |
`limit` | integer |
`callback` | callback | `function(err, deleted, res) {}`

##### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`deleted` | integer | number of entries deleted
`res` | object | [see](#res-struct)

##### Example
```javascript
client.deleteRange("a", "Z", 100, function(err, deleted, res) {
    console.log('deleted %d entries', deleted)
})
```

### <a name="client-prepare"></a> client.prepare()

Return you a new *prepared* client. It has all the [methods](#client-methods) from the original [client](#client).
Read [Advanced client usage II](#example-advanced-2) to understand how to use this client.
You should always use this client when sending in multiple queries, this will batch them together in a single request.

##### <a name="prep-client-methods"></a> Methods

| method | description |
| --- | --- |
| [flush](#prep-client-flush) | Flush the prepared queries |


##### Example
```javascript
var c = client.prepare()

c.get("key", function(err, value, res) {
    // Do something...
})

c.get("key2", function(err, value, res) {
    // Do something...
})

c.put("key3", "value", function(err, res) {
    // Do something...
})

c.flush()
```

### <a name="prep-client-flush"></a> client.flush(callback)

Flush the prepared queries buffer, and send it as a batch request.

##### Parameters

name | type | description
--- | --- | ----
`callback` | callback | optional


##### Callback

name | type | description
--- | --- | ----
`err` | Error() | batch request failed
`res` | object | [see](#res-struct)

##### Example
```javascript
client.flush(function(err, res) {
    if(err) {
        // Flush failed..
    }
    else {
        console.log('flushed %d queries.', res.responses.length)
    }
})
```

##### Returns

Returns an response object.

property | type | description
--- | --- | ----
`err` | Error() | is null if no error was returned
`value` | string, number, boolean | general response value
`res` | object | [see](#res-struct)

### <a name="client-runTransaction"></a> client.runTransaction(opts, transaction, callback)

RunTransaction executes a retryable `transaction` function in
the context of a distributed transaction. The transaction is
automatically aborted if retryable function returns any error aside from
recoverable internal errors, and is automatically committed otherwise.
retryable should have no side effects which could cause problems in the event
it must be run more than once. The `opts` contains transaction settings.

##### Parameters

name | type | description
--- | --- | ----
`opts` | object | [options](#transaction-options)
`transacation` | [retryable function](#retryable-function) | `function(txn, commit, abort) {}`
`callback` | callback | `function(err, res) {}`

##### <a name="transaction-options"></a> Transaction options

opt | description | default
--- | --- | ---
`name` | transaction name for debugging | `""`
`isolation` |  | `0`


##### Callback

name | type | description
--- | --- | ----
`err` | Error() | if transaction fails
`res` | object | [see](#res-struct)

## <a name="extra"></a>Extra

### <a name="res-struct"></a> Response properties

The `res` argument contains the full database response, each database command can
contain a different set of properties. This document will try to state some of the possible properties.

##### Properties

property | type | description  
--- | --- | ---
`timestamp` | integer | timestamp of the returned entry
`wall_time` | integer | timestamp of when the read or write operation was performed

### <a name="retryable-function"></a> Transaction function

The transaction function is an retryable function, it may be
executed more than once. This function should never forget to
call `commit` or `abort`. Throwing an error inside this
function also aborts the transaction.

##### Arguments
name | type | description
--- | --- | ----
`txn` | [Prepared client](#client-prepare) | this client is the same as `client.prepare()`, you can flush yourself if you don't wan't to commit yet.
`commit` | callback | to try to commit transaction
`abort` | callback | to abort transaction

* `abort()` accepts an optional `Error`. This error will be passed to the
[.runTransaction](#client-runTransaction) callback.

##### Example

```javascript
var transaction = function(txn, commit, abort) {
    txn = txn.prepare()

    for(var i = 0; i < 100; i++) {
        var key = i.toString()

        txn.put(key, "hello")
    }

    // Commit automatically flushes
    // the prepared transaction.
    commit()
}
```

### <a name="compile-proto-files"></a> Compiling .proto files

Cockroachdb's protocol buffer files are mantained at a repository called [cockroachdb/cockroach-proto](http://github.com/cockroachdb/cockroach-proto), this is
maintained as a `subtree` in this library, in case you need to manually update or change them, follow this steps.

##### If you want to sync them with the latest proto files

You will need to update the folder **cockroach-proto** with the latest content of the [cockroachdb/cockroach-proto](http://github.com/cockroachdb/cockroach-proto) repository, you could do this with:
```bash
$ git subtree pull -P cockroach-proto git@github.com:cockroachdb/cockroach-proto.git master --squash
```
* Notice: I'm not sure if this is a good pattern, just be sure to update the folder contents.

##### Recompile the .proto files

Run the following npm script to compile the .proto files to javascript, it will automatically place the files in the lib folder.
```bash
$ npm run build-proto
```

## Maintainers

* [herenow](/herenow)
