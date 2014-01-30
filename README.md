callback-pool
==========

Simple utility to queue callbacks in a pool until the drain has been unplugged.

`npm install callback-pool --save`

##Example
````javascript
var pool = require('callback-pool');
var myPool = pool.create();//creates a new pool

//these are queued up
myPool.add(function(a, b){console.log('foo');});
myPool.add(function(a, b){console.log('boo');});

myPool.drain(1,2);//all callbacks are executed asynchronously with 1 and 2.

//these are now asynchronously executed immediately with 1 and 2
myPool.add(function(a, b){console.log('execute me');});
myPool.add(function(a, b){console.log('me too');});

myPool.plug();//allows you to start over.
````
