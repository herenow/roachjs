RoachJS - CockroachDB Driver
=======

* [Introduction](#introduction)
* [Documentation](#documentation)
* [CockroachDB](https://github.com/cockroachdb/cockroach)

## <a name="introduction"></a>Introduction

This client is a port from the original [Golang client](http://godoc.org/github.com/cockroachdb/cockroach/client).
Internally it's is more or less the same, but this driver provides a friendlier javascript interface.

## <a name="documentation"></a> Documentation

* [Examples](#examples)
    * [Initiating a client](#example-init-client)
    * [Basic client usage I](#example-basic-1)
    * [Advanced client usage I (Prepare & Flush)](#example-advanced-1)
    * [Advanced client usage II (Response & Prepare & Flush)](#example-advanced-2)
    * [Advanced client usage III (Transactions)](#example-advanced-3)
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
            * [.Response()](#prep-client-Response)
            * [.flush(callback)](#prep-client-flush)
* [Extra](#extra)
    * [Meta properties](#meta-structure)

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
client.get("sample_key", function(err, value, meta) {
    if(err) throw err

    client.put("other_key", value, function(err) {
        if(err) {
            // Failed
        }
        else {
            // Sucess
        }
    })
})
```

### <a name="example-advanced-1"></a> Advanced client usage I
```javascript
// You should prepare your queries and send them in a single batch
// For optimal performance
// This actually returns you a new client
var c = client.prepare()

// This callback will be the first to be executed
c.get("sample_key", function(err, value, meta) {
    if(err) throw err

    // Do something...
})

c.get("sample_key2", function(err, value, meta) {
    if(err) throw err

    // Do something...
})

c.put("some_key", "some_value", function(err) {
    if(err) throw err

    // Do something
})

// The flush callback is the last one to be called
c.flush(function(err, meta) {
    if(err) throw err

    console.log('Sucessfuly flushed %d queries.', meta.flushed)
})
```

### <a name="example-advanced-2"></a> Advanced client usage II
```javascript
var c = client.prepare()

// This objects (references) will be sent in place of the callback
// This pattern is a great pattern to keep your sanity :)
var dogsResp    = c.Response()
var kittensResp = c.Response()

c.get("dogs", dogsResp)
c.get("kittens", kittensResp)

c.flush(function(err) {
    if(err) throw err

    if(dogsResp.err) {
        throw new Error('failed to get dogs')
    }

    if(kittensResp.err) {
        throw new Error('failed to get kittens')
    }

    c.put("other_dogs", dogsResp.value, function(err) {
        if(err) throw err
    })

    c.put("other_kittens", kittensResp.value, function(err) {
        if(err) throw err
    })

    c.flush()
})
```

### <a name="example-advanced-3"></a> Advanced client usage III
```javascript
// TODO:
```

## <a name="interface"></a> Interface

### <a name="client"></a> new Client(opts)

Returns a new roachjs client with [options](#client-options).

#### Parameters

name | type | description
--- | --- | ----
`opts` | object | [see](#client-options)

#### <a name="client-options"></a> Client options

opt | description | default
--- | --- | ---
`uri` | uri to the cockroach http endpoint | `http://127.0.0.1:8080/`
`host` | host or ip to the cockroach http endpoint | `127.0.0.1`
`port` | port to the cockroach http endpoint | `8080`
`ssl` | connect throught https | `false`
`user` | user to run the requests with | `root`
`retry` | retry requests when cockroach responds with a busy signal | `true`
`http` | http module to use | `require('http')`
`clock` | clock module to use | `new Date()`

#### <a name="client-methods"></a> Methods

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

### <a name="client-get"></a> client.get(key, callback)

Gets a single entry from the datastore, specified by `key`.

#### Parameters

name | type | description
--- | --- | ----
`key` | string |  
`callback` | callback | `function(err, value, meta) {}`

#### Callback

name | type | description
--- | --- | ----
`err` | Error() |  
`value` | string |  
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.get("key", function(err, value, meta) {})
```

### <a name="client-put"></a> client.put(key, value, callback)

Puts a value in the datastore in the specified `key`.

#### Parameters

name | type | description
--- | --- | ----
`key` | string |
`value` | string |
`callback` | callback | `function(err, meta) {}`

#### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.put("key", "value", function(err, meta) {})
```

### <a name="client-conditionalPut"></a> client.conditionalPut(key, value, ifValue, callback)

ConditionalPut sets the `value` for a `key` if the existing value matches the `ifValue`.
Specifying an empty or null `ifValue` means the entry must not yet exist.

#### Parameters

name | type | description
--- | --- | ----
`key` | string |
`value` | string |
`ifValue` | string, null | use null to put if entry doens't exists  
`callback` | callback | `function(err, meta) {}`

#### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.conditionalPut("status", "running", "stopped", function(err, meta) {})
client.conditionalPut("status", "new", null, function(err, meta) {})
```

### <a name="client-contains"></a> client.contains(key, callback)

Contains determines if a `key` exists in the datastore.

#### Parameters

name | type | description
--- | --- | ----
`key` | string |
`callback` | callback | `function(err, exists, meta) {}`

#### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`exists` | boolean |
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.contains("john", function(err, exists, meta) {
    if(exists === true) {
        // john exists in the datastore
    }
})
```

### <a name="client-increment"></a> client.increment(key, increment, callback)

Increment increments the value at the specified `key` by some `increment` value.
Once called for a `key`, Put & Get will return errors; only Increment will continue to be a valid command.
The value must be deleted before it can be reset using Put.

#### Parameters

name | type | description
--- | --- | ----
`key` | string |
`increment` | integer |
`callback` | callback | `function(err, newValue, meta) {}`

#### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`newValue` | integer |  the new value for this counter, after the increment operation
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.increment("counter", 5, function(err, newValue, meta) {
    console.log('counter current value is', newValue)
})
```

### <a name="client-scan"></a> client.scan(start_key, end_key, limit, callback)

Scan the datastore for keys in the range of the `start_key` and `end_key`, limiting the result by `limit`.

#### Parameters

name | type | description
--- | --- | ----
`key` | string |
`start_key` | string |
`end_key` | string |
`limit` | integer |
`callback` | callback | `function(err, newValue, meta) {}`

#### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`results` | array |
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.scan("a", "Z", 100, function(err, results, meta) {
    for(value as results) {
        console.log(value)
    }
})
```

### <a name="client-delete"></a> client.delete(key, callback)

Delete an entry from the datastore specified by `key`.

#### Parameters

name | type | description
--- | --- | ----
`key` | string |
`callback` | callback | `function(err, meta) {}`

#### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.delete("key", function(err, meta) {})
```

### <a name="client-deleteRange"></a> client.deleteRange(start_key, end_key, limit, callback)

Delete all keys found in a range, from `start_key` to `end_key`, limited by `limit`.

#### Parameters

name | type | description
--- | --- | ----
`key` | string |
`start_key` | string |
`end_key` | string |
`limit` | integer |
`callback` | callback | `function(err, deleted, meta) {}`

#### Callback

name | type | description
--- | --- | ----
`err` | Error() |
`deleted` | integer | number of entries deleted
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.deleteRange("a", "Z", 100, function(err, deleted, meta) {
    console.log('deleted %d entries', deleted)
})
```

### <a name="client-prepare"></a> client.prepare()

Return you a new *prepared* client. It inherits all the [methods](#client-methods) from the original [client](#client).
Read [Advanced client usage II](#example-advanced-2) and [Advanced client usage III](#example-advanced-3) to understand how to use this client.

#### <a name="prep-client-methods"></a> Methods

| method | description |
| --- | --- |
| [flush](#prep-client-flush) | Flush the prepared queries |
| [Response](#prep-client-Response) | [see](#example-advanced-3) |


#### Example
```javascript
var c = client.prepare()

c.get("key", function(err, value, meta) {
    // Do something...
})

c.get("key2", function(err, value, meta) {
    // Do something...
})

c.put("key3", "value", function(err, meta) {
    // Do something...
})

c.flush()
```

### <a name="prep-client-flush"></a> client.flush(callback)

Flush the prepared queries buffer, and send it as a batch request.

#### Parameters

name | type | description
--- | --- | ----
`callback` | callback | optional


#### Callback

name | type | description
--- | --- | ----
`err` | Error() | batch request failed
`meta` | object | [see](#meta-struct)

#### Example
```javascript
client.flush(function(err, meta) {
    if(err) {
        // Flush failed..
    }
    else {
        console.log('flushed %d queries.', meta.flushed)
    }
})
```

### <a name="prep-client-flush"></a> client.Response()

Flush the prepared queries buffer, and send it as a batch request.
Read [Advanced client usage III](#example-advanced-3) to learn how to use this pattern.

#### Returns

Returns an response object.

property | type | description
--- | --- | ----
`err` | Error() | is null if no error was returned
`value` | string, number, boolean | general response value
`meta` | object | [see](#meta-struct)

## <a name="extra"></a>Extra

### <a name="meta-struct"></a> Meta properties

The meta argument contains information about the request response, and any other extra
information data about the returned value.

#### Properties

property | type | description  
--- | --- | ---
`timestamp` | integer | timestamp of the returned entry
`wall_time` | integer | timestamp of when the read or write operation was performed
`flushed` | integer | number of flushed queries

## Contributors

* [herenow](/herenow)
