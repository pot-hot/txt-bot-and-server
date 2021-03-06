//Tests for the log component

//Dependencies
const assert = require('assert');
const log = require('../src/log');

describe('log', function(){

  describe('write', function(){

    it('log.write should work with valid input', function(done){
      log.write(0, 'this was generated by automated testing', {test: true}, function(err, doc){
        assert.ok(!err);
        assert.ok(doc);
        assert.equal(doc.level, 0);
        done();
      });
    });

    it('global.log should work with valid input', function(done){
      global.log(0, 'test', 'this was generated by automated testing', {test: true}, function(err, doc){
        assert.ok(!err);
        assert.ok(doc);
        assert.equal(doc.level, 0);
        done();
      });
    });

  });

  describe('read', function(){

    it('reading logs for the last day and level 0 should work', function(done){
      log.read(0, new Date(Date.now() - 1000 * 60 * 60 * 24), function(err, docs){
        assert.ok(!err);
        assert.ok(docs);
        assert.ok(docs.length > 0);
        done();
      });
    });

  });

  describe('readById', function(){

    it('reading a log by id should work', function(done){
      log.read(0, new Date(Date.now() - 1000 * 60 * 60 * 24), function(err, docs){
        assert.ok(!err);
        assert.ok(docs);
        assert.ok(docs.length > 0);
        log.readById(docs[0]._id, function(err, doc){
          assert.ok(!err);
          assert.ok(doc);
          assert.equal(doc._id.toString(), docs[0]._id.toString());
          done();
        });
      });
    });

  });

  describe('prune', function(){

    it('pruning all logs in the past 30 days shouldnt return an error', function(done){
      log.prune(30, function(err){
        assert.ok(!err);
        done();
      });
    });

  });

});