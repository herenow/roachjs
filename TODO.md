* Replace stuff like res.get('header').get('user') to direct access res.header.user
* Check if transaction/retry errors are being checked correctly, i'm not sure if this protobuf
librarie can do type checking.
* Map this errors https://github.com/cockroachdb/cockroach/blob/master/proto/errors.proto#L131

