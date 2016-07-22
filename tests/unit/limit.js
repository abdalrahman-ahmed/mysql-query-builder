'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;

let MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();

beforeEach(function(done) {
  mqb.reset();
  done();
});

describe('limit', function() {
  it('limit (start, limit)', function() {
    const obj = mqb.limit(0, 100);
    assert(Array.isArray(mqb._limit));
    assert.equal(mqb._limit.length, 2);
    assert.equal(mqb._limit[0], 0);
    assert.equal(mqb._limit[1], 100);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('limit ()', function() {
    const obj = mqb.limit();
    assert(Array.isArray(mqb._limit));
    assert.equal(mqb._limit.length, 2);
    assert.equal(mqb._limit[0], 0);
    assert.equal(mqb._limit[1], 1000);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
});
