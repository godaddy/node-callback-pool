"use strict";

describe("callback-pool", function(){
  var pool = require('../lib');

  it("can create new pools", function(){
    var myPool = pool.create();
    myPool.add.should.be.type('function');
    myPool.drain.should.be.type('function');
    myPool.plug.should.be.type('function');
  });

  describe("pools", function(){
    var myPool;

    beforeEach(function(){
      myPool = pool.create();
    });

    it("can add callbacks and drain them", function(done){
      var args = [];
      myPool.add(
        function(a,b){args.push(a);args.push(b);},
        function(a,b){args.push(a);args.push(b);}
      );
      myPool.add(
        function(a,b){args.push(a);args.push(b);},
        function(a,b){args.push(a);args.push(b);}
      );
      myPool.drain(1,3);

      setTimeout(function(){
        args.join('').should.equal('13131313');
        done();
      }, 10);
    });

    it("can plug after having run callbacks", function(done){
      var args = [];

      myPool.add(function(){args.push(1);});
      myPool.add(function(){args.push(2);}, function(){args.push(3);});

      myPool.drain();

      myPool.plug().add(function(){args.push(3);});
      setTimeout(function(){
        args.join('').should.equal('123');
        done();
      }, 100);
    });

    describe("once drained", function(){
      var args = [];
      beforeEach(function(done){
        myPool.add(function(){args.push(1);});
        myPool.add(function(){args.push(2);});
        myPool.drain();
        setTimeout(function(){
          args.join('').should.equal('12');
          done();
        });
      });

      it("no longer pools callbacks", function(done){
        myPool.add(function(){args.push(3);});
        setTimeout(function(){
          args.join('').should.equal('123');
          done();
        }, 10);
      });
    });
  });

  describe("pools with max", function(){
    var myPool;
    var args = [];

    beforeEach(function(){myPool = pool.create(5);args.length = 0;});

    it("only accepts the max number of callbacks", function(done){
      myPool.add(
        function(){args.push(1);},
        function(){args.push(2);},
        function(){args.push(3);},
        function(){args.push(4);},
        function(){args.push(5);},
        function(){args.push(3);},
        function(){args.push(3);},
        function(){args.push(3);}
      );
      myPool.drain();
      setTimeout(function(){
        args.join('').should.equal('12345');
        done();
      }, 10);
    });
  });
});
