* Replace stuff like res.get('header').get('user') to direct access res.header.user
* Check if transaction/retry errors are being checked correctly, i'm not sure if this protobuf
librarie can do type checking.
* Map this errors https://github.com/cockroachdb/cockroach/blob/master/proto/errors.proto#L131, check this https://developers.google.com/protocol-buffers/docs/techniques#union to determine implememtantion, you should also redo the batch union interface
* Check if https://github.com/herenow/roachjs/blob/master/lib/txn_sender.js#L36 is working as expected.
