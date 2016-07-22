var assert = require('chai').assert;
var expect = require('chai').expect;

let MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();

beforeEach(function(done) {
  mqb.reset();
  done();
});

describe('orderBy', function() {
  it('orderBy (orderFields = string, order = asc)', function() {
    const obj = mqb.orderBy('name', 'asc');
    assert(Array.isArray(mqb._orderBy));
    assert.equal(mqb._orderBy.length, 1);
    assert.equal(mqb._orderBy[0].fields, 'name');
    assert.equal(mqb._orderBy[0].order, 'asc');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('orderBy (orderFields = string, order = desc)', function() {
    const obj = mqb.orderBy('name', 'desc');
    assert(Array.isArray(mqb._orderBy));
    assert.equal(mqb._orderBy.length, 1);
    assert.equal(mqb._orderBy[0].fields, 'name');
    assert.equal(mqb._orderBy[0].order, 'desc');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('orderBy (orderFields = string)', function() {
    const obj = mqb.orderBy('name');
    assert(Array.isArray(mqb._orderBy));
    assert.equal(mqb._orderBy.length, 1);
    assert.equal(mqb._orderBy[0].fields, 'name');
    assert.equal(mqb._orderBy[0].order, 'ASC');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('orderBy (orderFields = array)', function() {
    const obj = mqb.orderBy(['name', 'email']);
    assert(Array.isArray(mqb._orderBy));
    assert.equal(mqb._orderBy.length, 1);
    assert.equal(mqb._orderBy[0].fields, 'name,email');
    assert.equal(mqb._orderBy[0].order, 'ASC');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('orderBy () throwing error', function() {
    expect(() => { mqb.orderBy(); }).to.throw("ORDER BY: fields must be string or array");
  });
});
describe('groupBy', function() {
  it('groupBy (fields)', function() {
    const obj = mqb.groupBy('name');
    assert.equal(mqb._groupBy, 'name');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
  it('orderBy (fields != string) throwing error', function() {
    expect(() => { mqb.groupBy(null); }).to.throw("GROUP BY: fields must be string");
  });
  it('orderBy () throwing error', function() {
    expect(() => { mqb.groupBy(); }).to.throw("GROUP BY: fields must be string");
  });
});
