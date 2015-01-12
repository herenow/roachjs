module.exports = require("protobufjs").newBuilder({})["import"]({
    "package": "proto",
    "messages": [
        {
            "name": "ClientCmdID",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "wall_time",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "random",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "RequestHeader",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "Timestamp",
                    "name": "timestamp",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.customname)": "CmdID"
                    },
                    "type": "ClientCmdID",
                    "name": "cmd_id",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.customtype)": "Key"
                    },
                    "type": "bytes",
                    "name": "key",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.customtype)": "Key"
                    },
                    "type": "bytes",
                    "name": "end_key",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "string",
                    "name": "user",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "Replica",
                    "name": "replica",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.customname)": "RaftID"
                    },
                    "type": "int64",
                    "name": "raft_id",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "options": {
                        "default": 1
                    },
                    "type": "int32",
                    "name": "user_priority",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "Transaction",
                    "name": "txn",
                    "id": 9
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ResponseHeader",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": "Error",
                    "name": "error",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "Timestamp",
                    "name": "timestamp",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "Transaction",
                    "name": "txn",
                    "id": 3
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ContainsRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ContainsResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "bool",
                    "name": "exists",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "GetRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "GetResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "Value",
                    "name": "value",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "PutRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "Value",
                    "name": "value",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "PutResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ConditionalPutRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "Value",
                    "name": "value",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "Value",
                    "name": "exp_value",
                    "id": 3
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ConditionalPutResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "Value",
                    "name": "actual_value",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "IncrementRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "increment",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "IncrementResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "new_value",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "DeleteRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "DeleteResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "DeleteRangeRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "max_entries_to_delete",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "DeleteRangeResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "num_deleted",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ScanRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "max_results",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ScanResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "KeyValue",
                    "name": "rows",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "EndTransactionRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "bool",
                    "name": "commit",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "SplitTrigger",
                    "name": "split_trigger",
                    "id": 3
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "EndTransactionResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "commit_wait",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ReapQueueRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "int64",
                    "name": "max_results",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "ReapQueueResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "Value",
                    "name": "messages",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "EnqueueUpdateRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "EnqueueUpdateResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "EnqueueMessageRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "Value",
                    "name": "msg",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "EnqueueMessageResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "RequestUnion",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": "ContainsRequest",
                    "name": "contains",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "GetRequest",
                    "name": "get",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "PutRequest",
                    "name": "put",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "ConditionalPutRequest",
                    "name": "conditional_put",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "IncrementRequest",
                    "name": "increment",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "DeleteRequest",
                    "name": "delete",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "DeleteRangeRequest",
                    "name": "delete_range",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "ScanRequest",
                    "name": "scan",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "EndTransactionRequest",
                    "name": "end_transaction",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "ReapQueueRequest",
                    "name": "reap_queue",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "EnqueueUpdateRequest",
                    "name": "enqueue_update",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "EnqueueMessageRequest",
                    "name": "enqueue_message",
                    "id": 12
                }
            ],
            "enums": [],
            "messages": [],
            "options": {
                "(gogoproto.onlyone)": true
            },
            "oneofs": {}
        },
        {
            "name": "ResponseUnion",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": "ContainsResponse",
                    "name": "contains",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "GetResponse",
                    "name": "get",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "PutResponse",
                    "name": "put",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "ConditionalPutResponse",
                    "name": "conditional_put",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "IncrementResponse",
                    "name": "increment",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "DeleteResponse",
                    "name": "delete",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "DeleteRangeResponse",
                    "name": "delete_range",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "ScanResponse",
                    "name": "scan",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "EndTransactionResponse",
                    "name": "end_transaction",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "ReapQueueResponse",
                    "name": "reap_queue",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "EnqueueUpdateResponse",
                    "name": "enqueue_update",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "EnqueueMessageResponse",
                    "name": "enqueue_message",
                    "id": 12
                }
            ],
            "enums": [],
            "messages": [],
            "options": {
                "(gogoproto.onlyone)": true
            },
            "oneofs": {}
        },
        {
            "name": "BatchRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "RequestUnion",
                    "name": "requests",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "BatchResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "options": {
                        "(gogoproto.nullable)": false
                    },
                    "type": "ResponseUnion",
                    "name": "responses",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "AdminSplitRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.customtype)": "Key"
                    },
                    "type": "bytes",
                    "name": "split_key",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "AdminSplitResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {
                        "(gogoproto.nullable)": false,
                        "(gogoproto.embed)": true
                    },
                    "type": "ResponseHeader",
                    "name": "header",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        }
    ],
    "enums": [],
    "imports": [
        {
            "package": "proto",
            "messages": [
                {
                    "name": "Attributes",
                    "fields": [
                        {
                            "rule": "repeated",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.moretags)": "yaml:\\\"attrs,flow\\\""
                            },
                            "type": "string",
                            "name": "attrs",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "Replica",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "NodeID"
                            },
                            "type": "int32",
                            "name": "node_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "StoreID"
                            },
                            "type": "int32",
                            "name": "store_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Attributes",
                            "name": "attrs",
                            "id": 3
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "RangeDescriptor",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "RaftID"
                            },
                            "type": "int64",
                            "name": "raft_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customtype)": "Key"
                            },
                            "type": "bytes",
                            "name": "start_key",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customtype)": "Key"
                            },
                            "type": "bytes",
                            "name": "end_key",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Replica",
                            "name": "replicas",
                            "id": 4
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "GCPolicy",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "TTLSeconds"
                            },
                            "type": "int32",
                            "name": "ttl_seconds",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "AcctConfig",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.moretags)": "yaml:\\\"cluster_id,omitempty\\\""
                            },
                            "type": "string",
                            "name": "cluster_id",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "PermConfig",
                    "fields": [
                        {
                            "rule": "repeated",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.moretags)": "yaml:\\\"read,omitempty\\\""
                            },
                            "type": "string",
                            "name": "read",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.moretags)": "yaml:\\\"write,omitempty\\\""
                            },
                            "type": "string",
                            "name": "write",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "ZoneConfig",
                    "fields": [
                        {
                            "rule": "repeated",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.moretags)": "yaml:\\\"replicas,omitempty\\\""
                            },
                            "type": "Attributes",
                            "name": "replica_attrs",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.moretags)": "yaml:\\\"range_min_bytes,omitempty\\\""
                            },
                            "type": "int64",
                            "name": "range_min_bytes",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.moretags)": "yaml:\\\"range_max_bytes,omitempty\\\""
                            },
                            "type": "int64",
                            "name": "range_max_bytes",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.customname)": "GC",
                                "(gogoproto.moretags)": "yaml:\\\"gc,omitempty\\\""
                            },
                            "type": "GCPolicy",
                            "name": "gc",
                            "id": 4
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                }
            ],
            "enums": [],
            "imports": [
                {
                    "package": "gogoproto",
                    "messages": [
                        {
                            "ref": "google.protobuf.EnumOptions",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_enum_prefix",
                                    "id": 62001
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_enum_stringer",
                                    "id": 62021
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "enum_stringer",
                                    "id": 62022
                                }
                            ]
                        },
                        {
                            "ref": "google.protobuf.FileOptions",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_getters_all",
                                    "id": 63001
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_enum_prefix_all",
                                    "id": 63002
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_stringer_all",
                                    "id": 63003
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "verbose_equal_all",
                                    "id": 63004
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "face_all",
                                    "id": 63005
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "gostring_all",
                                    "id": 63006
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "populate_all",
                                    "id": 63007
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "stringer_all",
                                    "id": 63008
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "onlyone_all",
                                    "id": 63009
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "equal_all",
                                    "id": 63013
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "description_all",
                                    "id": 63014
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "testgen_all",
                                    "id": 63015
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "benchgen_all",
                                    "id": 63016
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "marshaler_all",
                                    "id": 63017
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "unmarshaler_all",
                                    "id": 63018
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "bufferto_all",
                                    "id": 63019
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "sizer_all",
                                    "id": 63020
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_enum_stringer_all",
                                    "id": 63021
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "enum_stringer_all",
                                    "id": 63022
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "unsafe_marshaler_all",
                                    "id": 63023
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "unsafe_unmarshaler_all",
                                    "id": 63024
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_extensions_map_all",
                                    "id": 63025
                                }
                            ]
                        },
                        {
                            "ref": "google.protobuf.MessageOptions",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_getters",
                                    "id": 64001
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_stringer",
                                    "id": 64003
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "verbose_equal",
                                    "id": 64004
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "face",
                                    "id": 64005
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "gostring",
                                    "id": 64006
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "populate",
                                    "id": 64007
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "stringer",
                                    "id": 67008
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "onlyone",
                                    "id": 64009
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "equal",
                                    "id": 64013
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "description",
                                    "id": 64014
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "testgen",
                                    "id": 64015
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "benchgen",
                                    "id": 64016
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "marshaler",
                                    "id": 64017
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "unmarshaler",
                                    "id": 64018
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "bufferto",
                                    "id": 64019
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "sizer",
                                    "id": 64020
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "unsafe_marshaler",
                                    "id": 64023
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "unsafe_unmarshaler",
                                    "id": 64024
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "goproto_extensions_map",
                                    "id": 64025
                                }
                            ]
                        },
                        {
                            "ref": "google.protobuf.FieldOptions",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "nullable",
                                    "id": 65001
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "bool",
                                    "name": "embed",
                                    "id": 65002
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "string",
                                    "name": "customtype",
                                    "id": 65003
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "string",
                                    "name": "customname",
                                    "id": 65004
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "string",
                                    "name": "jsontag",
                                    "id": 65005
                                },
                                {
                                    "rule": "optional",
                                    "options": {},
                                    "type": "string",
                                    "name": "moretags",
                                    "id": 65006
                                }
                            ]
                        }
                    ],
                    "enums": [],
                    "imports": [],
                    "options": {},
                    "services": []
                }
            ],
            "options": {},
            "services": []
        },
        {
            "package": "proto",
            "messages": [
                {
                    "name": "Timestamp",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "int64",
                            "name": "wall_time",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "int32",
                            "name": "logical",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {
                        "(gogoproto.goproto_stringer)": false
                    },
                    "oneofs": {}
                },
                {
                    "name": "Value",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "bytes",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "integer",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "fixed32",
                            "name": "checksum",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "Timestamp",
                            "name": "timestamp",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "string",
                            "name": "tag",
                            "id": 5
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "MVCCValue",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "bool",
                            "name": "deleted",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "Value",
                            "name": "value",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "KeyValue",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customtype)": "Key"
                            },
                            "type": "bytes",
                            "name": "key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Value",
                            "name": "value",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "RawKeyValue",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customtype)": "EncodedKey"
                            },
                            "type": "bytes",
                            "name": "key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "bytes",
                            "name": "value",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "StoreIdent",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "ClusterID"
                            },
                            "type": "string",
                            "name": "cluster_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "NodeID"
                            },
                            "type": "int32",
                            "name": "node_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "StoreID"
                            },
                            "type": "int32",
                            "name": "store_id",
                            "id": 3
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "SplitTrigger",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "RangeDescriptor",
                            "name": "updated_desc",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "RangeDescriptor",
                            "name": "new_desc",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "NodeList",
                    "fields": [
                        {
                            "rule": "repeated",
                            "options": {
                                "packed": true
                            },
                            "type": "int32",
                            "name": "nodes",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "Transaction",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "string",
                            "name": "name",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customtype)": "Key"
                            },
                            "type": "bytes",
                            "name": "key",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "ID"
                            },
                            "type": "bytes",
                            "name": "id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "int32",
                            "name": "priority",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "IsolationType",
                            "name": "isolation",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "TransactionStatus",
                            "name": "status",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "int32",
                            "name": "epoch",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "Timestamp",
                            "name": "last_heartbeat",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Timestamp",
                            "name": "timestamp",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Timestamp",
                            "name": "orig_timestamp",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Timestamp",
                            "name": "max_timestamp",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "NodeList",
                            "name": "certain_nodes",
                            "id": 12
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {
                        "(gogoproto.goproto_stringer)": false
                    },
                    "oneofs": {}
                },
                {
                    "name": "MVCCMetadata",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "Transaction",
                            "name": "txn",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Timestamp",
                            "name": "timestamp",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "bool",
                            "name": "deleted",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "int64",
                            "name": "key_bytes",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "int64",
                            "name": "val_bytes",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "Value",
                            "name": "value",
                            "id": 6
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "GCMetadata",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "LastGCNanos"
                            },
                            "type": "int64",
                            "name": "last_gc_nanos",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "TTLSeconds"
                            },
                            "type": "int32",
                            "name": "ttl_seconds",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "int64",
                            "name": "byte_counts",
                            "id": 3
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                }
            ],
            "enums": [
                {
                    "name": "IsolationType",
                    "values": [
                        {
                            "name": "SERIALIZABLE",
                            "id": 0
                        },
                        {
                            "name": "SNAPSHOT",
                            "id": 1
                        }
                    ],
                    "options": {
                        "(gogoproto.goproto_enum_prefix)": false
                    }
                },
                {
                    "name": "TransactionStatus",
                    "values": [
                        {
                            "name": "PENDING",
                            "id": 0
                        },
                        {
                            "name": "COMMITTED",
                            "id": 1
                        },
                        {
                            "name": "ABORTED",
                            "id": 2
                        }
                    ],
                    "options": {
                        "(gogoproto.goproto_enum_prefix)": false
                    }
                }
            ],
            "imports": [],
            "options": {},
            "services": []
        },
        {
            "package": "proto",
            "messages": [
                {
                    "name": "GenericError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "string",
                            "name": "message",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "bool",
                            "name": "retryable",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "NotLeaderError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Replica",
                            "name": "leader",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "RangeNotFoundError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customname)": "RaftID"
                            },
                            "type": "int64",
                            "name": "raft_id",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "RangeKeyMismatchError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customtype)": "Key"
                            },
                            "type": "bytes",
                            "name": "request_start_key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customtype)": "Key"
                            },
                            "type": "bytes",
                            "name": "request_end_key",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "RangeDescriptor",
                            "name": "range",
                            "id": 3
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "ReadWithinUncertaintyIntervalError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Timestamp",
                            "name": "timestamp",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Timestamp",
                            "name": "existing_timestamp",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "TransactionAbortedError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Transaction",
                            "name": "txn",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "TransactionPushError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "Transaction",
                            "name": "txn",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Transaction",
                            "name": "pushee_txn",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "TransactionRetryError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Transaction",
                            "name": "txn",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "TransactionStatusError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Transaction",
                            "name": "txn",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "string",
                            "name": "msg",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "WriteIntentError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false,
                                "(gogoproto.customtype)": "Key"
                            },
                            "type": "bytes",
                            "name": "key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Transaction",
                            "name": "txn",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "bool",
                            "name": "resolved",
                            "id": 3
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "WriteTooOldError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Timestamp",
                            "name": "timestamp",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {
                                "(gogoproto.nullable)": false
                            },
                            "type": "Timestamp",
                            "name": "existing_timestamp",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "OpRequiresTxnError",
                    "fields": [],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "Error",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "GenericError",
                            "name": "generic",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "NotLeaderError",
                            "name": "not_leader",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "RangeNotFoundError",
                            "name": "range_not_found",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "RangeKeyMismatchError",
                            "name": "range_key_mismatch",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "ReadWithinUncertaintyIntervalError",
                            "name": "read_within_uncertainty_interval",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "TransactionAbortedError",
                            "name": "transaction_aborted",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "TransactionPushError",
                            "name": "transaction_push",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "TransactionRetryError",
                            "name": "transaction_retry",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "TransactionStatusError",
                            "name": "transaction_status",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "WriteIntentError",
                            "name": "write_intent",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "WriteTooOldError",
                            "name": "write_too_old",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "OpRequiresTxnError",
                            "name": "op_requires_txn",
                            "id": 12
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                }
            ],
            "enums": [],
            "imports": [],
            "options": {},
            "services": []
        }
    ],
    "options": {},
    "services": []
}).build("proto");
