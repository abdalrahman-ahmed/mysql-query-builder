'use strict';
let assert = require('chai').assert;
let mqb = require('../../index.js');
let mqbUnit = new mqb();
//var mocks = require('./mocks.js');

describe('Checking default properties', function() {
  it('dbConnection', function() {
    assert.equal(mqbUnit._dbConnection, undefined);
  });
  it('_table', function() {
    assert.equal(mqbUnit._table, null);
  });
  it('_queryType', function() {
    assert.equal(mqbUnit._queryType, null);
  });
  it('_fields', function() {
    assert.equal(mqbUnit._fields, null);
  });
  it('_values', function() {
    assert.equal(mqbUnit._values, null);
  });
  it('_where', function() {
    assert(Array.isArray(mqbUnit._where), 'is array');
    assert.equal(mqbUnit._where.length, 0);
  });
  it('_like', function() {
    assert(Array.isArray(mqbUnit._like), 'is array');
    assert.equal(mqbUnit._like.length, 0);
  });
  it('_join', function() {
    assert(Array.isArray(mqbUnit._join), 'is array');
    assert.equal(mqbUnit._join.length, 0);
  });
  it('_limit', function() {
    assert.equal(mqbUnit._limit[0], 0);
    assert.equal(mqbUnit._limit[1], 1000);
  });
  it('_orderBy', function() {
    assert(Array.isArray(mqbUnit._orderBy), 'is array');
    assert.equal(mqbUnit._orderBy.length, 0);
  });
  it('_groupBy', function() {
    assert.equal(mqbUnit._groupBy, null);
  });
  it('dbQuery', function() {
    assert.equal(mqbUnit.dbQuery, null);
  });
  it('queries', function() {
    assert(Array.isArray(mqbUnit.queries), 'is array');
    assert.equal(mqbUnit.queries.length, 0);
  });
  it('having', function() {
    assert(Array.isArray(mqbUnit._having), 'is array');
    assert.equal(mqbUnit._having.length, 0);
  });
});
