'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;

let MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();
beforeEach(function(done) {
  mqb.reset();
  done();
});

describe('from', function() {
  it('from (table)', function() {
    const obj = mqb.from('table1');
    assert.equal(mqb._table, 'table1');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
  it('from (table == undefined) throwing error', function() {
    expect(() => { mqb.from(); }).to.throw("From: Table is undefined");
  });
});

describe('where', function() {
  it('where (key, value) key, value — string params', function() {
    const obj = mqb.where('id', 1);
    assert(Array.isArray(mqb._where));
    assert.equal(mqb._where.length, 1);
    assert.equal(mqb._where[0].key, 'id');
    assert.equal(mqb._where[0].value, 1);
    assert.equal(mqb._where[0].or, false);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('where (key == object, value == undefined)', function() {
    const obj = mqb.where({'id': 1});
    assert(Array.isArray(mqb._where));
    assert.equal(mqb._where.length, 1);
    assert.equal(mqb._where[0].key, 'id');
    assert.equal(mqb._where[0].value, 1);
    assert.equal(mqb._where[0].or, false);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('where (key == undefined, value == undefined) throwing error', function() {
    expect(() => { mqb.where(); }).to.throw("Where: nor key neither value is specified");
  });
});

describe('whereObject', function() {
  it('whereObject (object == object)', function() {
    const obj = mqb.whereObject({'id': 1});
    assert(Array.isArray(mqb._where));
    assert.equal(mqb._where.length, 1);
    assert.equal(mqb._where[0].key, 'id');
    assert.equal(mqb._where[0].value, 1);
    assert.equal(mqb._where[0].or, false);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('whereObject (object == undefined)) throwing error', function() {
    expect(() => { mqb.whereObject(); }).to.throw("Where: expected object got undefined");
  });
});

describe('whereOR', function() {
  it('whereOR (key, value) key, value — string params', function() {
    const obj = mqb.whereOR('id', 1);
    assert(Array.isArray(mqb._where));
    assert.equal(mqb._where.length, 1);
    assert.equal(mqb._where[0].key, 'id');
    assert.equal(mqb._where[0].value, 1);
    assert.equal(mqb._where[0].or, true);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('whereOR (key, value == undefined) throwing error', function() {
    expect(() => { mqb.whereOR('id'); }).to.throw("Where OR: value is undefined");
  });

  it('whereOR (key == undefined, value == undefined) throwing error', function() {
    expect(() => { mqb.whereOR(); }).to.throw("Where OR: nor key neither value is specified");
  });
});
