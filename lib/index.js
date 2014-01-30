"use strict";

module.exports.create = create;

function create(max){
  var callbacks = [];
  var plugged = true;
  var args = null;

  return {
    add:function(){
      var newCallbacks = [].slice.call(arguments).filter(callbackFilter);
      if(plugged){
        callbacks = callbacks.concat(newCallbacks);
        if(max > 0){
          callbacks.splice(max);
        }
      } else {
        run(newCallbacks, args);
      }
      return this;
    },
    drain:function(){
      args = [].slice.call(arguments);
      plugged = false;
      run(callbacks, args);
      callbacks = [];
      return this;
    },
    plug:function(){
      args = null;
      plugged = true;
      return this;
    }
  };
}

function callbackFilter(cb){
  return typeof cb === 'function';
}

function run(callbacks, args){
  var cb;
  var len = callbacks.length;
  var i;
  args.unshift(null);
  for(i=0;i<len;i++){
    cb = callbacks[i];
    process.nextTick(cb.bind.apply(cb, args));
  }
}
