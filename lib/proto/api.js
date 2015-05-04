module.exports = require("protobufjs").newBuilder({})["import"]({
    "package": "cockroach.proto",
    "messages": [
        {
            "name": "ClientCmdID",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": "int64",
                    "name": "wall_time",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "options": {},
                    "type": ".cockroach.proto.Timestamp",
                    "name": "timestamp",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ClientCmdID",
                    "name": "cmd_id",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "bytes",
                    "name": "key",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "bytes",
                    "name": "end_key",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "string",
                    "name": "user",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.Replica",
                    "name": "replica",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "type": ".cockroach.proto.Transaction",
                    "name": "txn",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ReadConsistencyType",
                    "name": "read_consistency",
                    "id": 10
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
                    "type": ".cockroach.proto.Error",
                    "name": "error",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.Timestamp",
                    "name": "timestamp",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.Transaction",
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.Value",
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.Value",
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.Value",
                    "name": "value",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.Value",
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
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
            "name": "IncrementRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "options": {},
                    "type": ".cockroach.proto.KeyValue",
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "bool",
                    "name": "commit",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.InternalCommitTrigger",
                    "name": "internal_commit_trigger",
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "int64",
                    "name": "commit_wait",
                    "id": 2
                },
                {
                    "rule": "repeated",
                    "options": {},
                    "type": "bytes",
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
            "name": "RequestUnion",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ContainsRequest",
                    "name": "contains",
                    "id": 1,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.GetRequest",
                    "name": "get",
                    "id": 2,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.PutRequest",
                    "name": "put",
                    "id": 3,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ConditionalPutRequest",
                    "name": "conditional_put",
                    "id": 4,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.IncrementRequest",
                    "name": "increment",
                    "id": 5,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.DeleteRequest",
                    "name": "delete",
                    "id": 6,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.DeleteRangeRequest",
                    "name": "delete_range",
                    "id": 7,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ScanRequest",
                    "name": "scan",
                    "id": 8,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.EndTransactionRequest",
                    "name": "end_transaction",
                    "id": 9,
                    "oneof": "value"
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {
                "value": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9
                ]
            }
        },
        {
            "name": "ResponseUnion",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ContainsResponse",
                    "name": "contains",
                    "id": 1,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.GetResponse",
                    "name": "get",
                    "id": 2,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.PutResponse",
                    "name": "put",
                    "id": 3,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ConditionalPutResponse",
                    "name": "conditional_put",
                    "id": 4,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.IncrementResponse",
                    "name": "increment",
                    "id": 5,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.DeleteResponse",
                    "name": "delete",
                    "id": 6,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.DeleteRangeResponse",
                    "name": "delete_range",
                    "id": 7,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ScanResponse",
                    "name": "scan",
                    "id": 8,
                    "oneof": "value"
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.EndTransactionResponse",
                    "name": "end_transaction",
                    "id": 9,
                    "oneof": "value"
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {
                "value": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9
                ]
            }
        },
        {
            "name": "BatchRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "options": {},
                    "type": ".cockroach.proto.RequestUnion",
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "options": {},
                    "type": ".cockroach.proto.ResponseUnion",
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
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
                    "name": "header",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
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
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
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
            "name": "AdminMergeRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.RequestHeader",
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
            "name": "AdminMergeResponse",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": ".cockroach.proto.ResponseHeader",
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
    "enums": [
        {
            "name": "ReadConsistencyType",
            "values": [
                {
                    "name": "CONSISTENT",
                    "id": 0
                },
                {
                    "name": "CONSENSUS",
                    "id": 1
                },
                {
                    "name": "INCONSISTENT",
                    "id": 2
                }
            ],
            "options": {}
        }
    ],
    "imports": [
        {
            "package": "cockroach.proto",
            "messages": [
                {
                    "name": "Attributes",
                    "fields": [
                        {
                            "rule": "repeated",
                            "options": {},
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
                            "options": {},
                            "type": "int32",
                            "name": "node_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int32",
                            "name": "store_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Attributes",
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
                            "options": {},
                            "type": "int64",
                            "name": "raft_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "start_key",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "end_key",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "options": {},
                            "type": ".cockroach.proto.Replica",
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
                            "options": {},
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
                            "options": {},
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
                            "options": {},
                            "type": "string",
                            "name": "read",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "options": {},
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
                            "options": {},
                            "type": ".cockroach.proto.Attributes",
                            "name": "replica_attrs",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "range_min_bytes",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "range_max_bytes",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.GCPolicy",
                            "name": "gc",
                            "id": 4
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "RangeTree",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "root_key",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "RangeTreeNode",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bool",
                            "name": "black",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "parent_key",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "left_key",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "right_key",
                            "id": 5
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
            "options": {
                "go_package": "proto"
            },
            "services": []
        },
        {
            "package": "cockroach.proto",
            "messages": [
                {
                    "name": "Timestamp",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "wall_time",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int32",
                            "name": "logical",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
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
                            "type": ".cockroach.proto.Timestamp",
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
                            "options": {},
                            "type": "bool",
                            "name": "deleted",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Value",
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
                            "options": {},
                            "type": "bytes",
                            "name": "key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Value",
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
                            "options": {},
                            "type": "bytes",
                            "name": "key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
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
                            "options": {},
                            "type": "string",
                            "name": "cluster_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int32",
                            "name": "node_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
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
                            "options": {},
                            "type": ".cockroach.proto.RangeDescriptor",
                            "name": "updated_desc",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.RangeDescriptor",
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
                    "name": "MergeTrigger",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.RangeDescriptor",
                            "name": "updated_desc",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "subsumed_raft_id",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "ChangeReplicasTrigger",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int32",
                            "name": "node_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int32",
                            "name": "store_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.ReplicaChangeType",
                            "name": "change_type",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "options": {},
                            "type": ".cockroach.proto.Replica",
                            "name": "updated_replicas",
                            "id": 4
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "InternalCommitTrigger",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.SplitTrigger",
                            "name": "split_trigger",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.MergeTrigger",
                            "name": "merge_trigger",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.ChangeReplicasTrigger",
                            "name": "change_replicas_trigger",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "options": {},
                            "type": "bytes",
                            "name": "intents",
                            "id": 4
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
                            "options": {},
                            "type": "string",
                            "name": "name",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "key",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int32",
                            "name": "priority",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.IsolationType",
                            "name": "isolation",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.TransactionStatus",
                            "name": "status",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int32",
                            "name": "epoch",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
                            "name": "last_heartbeat",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
                            "name": "timestamp",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
                            "name": "orig_timestamp",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
                            "name": "max_timestamp",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.NodeList",
                            "name": "certain_nodes",
                            "id": 12
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "Lease",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "expiration",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "duration",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "uint64",
                            "name": "term",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "uint64",
                            "name": "raft_node_id",
                            "id": 4
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "MVCCMetadata",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Transaction",
                            "name": "txn",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
                            "name": "timestamp",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bool",
                            "name": "deleted",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "key_bytes",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "val_bytes",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Value",
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
                            "options": {},
                            "type": "int64",
                            "name": "last_scan_nanos",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "oldest_intent_nanos",
                            "id": 2
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "TimeSeriesDatapoint",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "timestamp_nanos",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "int_value",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "float",
                            "name": "float_value",
                            "id": 3
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "TimeSeriesData",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "string",
                            "name": "name",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "string",
                            "name": "source",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "options": {},
                            "type": ".cockroach.proto.TimeSeriesDatapoint",
                            "name": "datapoints",
                            "id": 3
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "MVCCStats",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "live_bytes",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "key_bytes",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "val_bytes",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "intent_bytes",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "live_count",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "key_count",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "val_count",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "intent_count",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "intent_age",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "gc_bytes_age",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "int64",
                            "name": "last_update_nanos",
                            "id": 11
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
                    "name": "ReplicaChangeType",
                    "values": [
                        {
                            "name": "ADD_REPLICA",
                            "id": 0
                        },
                        {
                            "name": "REMOVE_REPLICA",
                            "id": 1
                        }
                    ],
                    "options": {}
                },
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
                    "options": {}
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
                    "options": {}
                }
            ],
            "imports": [],
            "options": {
                "go_package": "proto"
            },
            "services": []
        },
        {
            "package": "cockroach.proto",
            "messages": [
                {
                    "name": "NotLeaderError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Replica",
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
                            "options": {},
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
                            "options": {},
                            "type": "bytes",
                            "name": "request_start_key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "request_end_key",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.RangeDescriptor",
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
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
                            "name": "timestamp",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
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
                            "options": {},
                            "type": ".cockroach.proto.Transaction",
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
                            "type": ".cockroach.proto.Transaction",
                            "name": "txn",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Transaction",
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
                            "options": {},
                            "type": ".cockroach.proto.Transaction",
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
                            "options": {},
                            "type": ".cockroach.proto.Transaction",
                            "name": "txn",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
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
                            "options": {},
                            "type": "bytes",
                            "name": "key",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Transaction",
                            "name": "txn",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
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
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
                            "name": "timestamp",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Timestamp",
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
                    "name": "ConditionFailedError",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.Value",
                            "name": "actual_value",
                            "id": 1
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "ErrorDetail",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.NotLeaderError",
                            "name": "not_leader",
                            "id": 1,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.RangeNotFoundError",
                            "name": "range_not_found",
                            "id": 2,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.RangeKeyMismatchError",
                            "name": "range_key_mismatch",
                            "id": 3,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.ReadWithinUncertaintyIntervalError",
                            "name": "read_within_uncertainty_interval",
                            "id": 4,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.TransactionAbortedError",
                            "name": "transaction_aborted",
                            "id": 5,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.TransactionPushError",
                            "name": "transaction_push",
                            "id": 6,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.TransactionRetryError",
                            "name": "transaction_retry",
                            "id": 7,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.TransactionStatusError",
                            "name": "transaction_status",
                            "id": 8,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.WriteIntentError",
                            "name": "write_intent",
                            "id": 9,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.WriteTooOldError",
                            "name": "write_too_old",
                            "id": 10,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.OpRequiresTxnError",
                            "name": "op_requires_txn",
                            "id": 11,
                            "oneof": "value"
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.ConditionFailedError",
                            "name": "condition_failed",
                            "id": 12,
                            "oneof": "value"
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {
                        "value": [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12
                        ]
                    }
                },
                {
                    "name": "Error",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "string",
                            "name": "message",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bool",
                            "name": "retryable",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.TransactionRestart",
                            "name": "transaction_restart",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": ".cockroach.proto.ErrorDetail",
                            "name": "detail",
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
                    "name": "TransactionRestart",
                    "values": [
                        {
                            "name": "ABORT",
                            "id": 0
                        },
                        {
                            "name": "BACKOFF",
                            "id": 1
                        },
                        {
                            "name": "IMMEDIATE",
                            "id": 2
                        }
                    ],
                    "options": {}
                }
            ],
            "imports": [],
            "options": {
                "go_package": "proto"
            },
            "services": []
        }
    ],
    "options": {
        "go_package": "proto"
    },
    "services": []
}).build("cockroach.proto");
