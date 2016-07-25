'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;

let MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();

beforeEach(function(done) {
  mqb.reset();
  done();
});

describe('having', function() {
  it('having (field, value, booleanOperator)', function() {
    const obj = mqb.having('name', 'Nik', 'or');
    assert(Array.isArray(mqb._having));
    assert.equal(mqb._having.length, 1);
    assert.equal(mqb._having[0].field, 'name');
    assert.equal(mqb._having[0].value, 'Nik');
    assert.equal(mqb._having[0].booleanOperator, 'OR');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('having (field = string, value = string)', function() {
    const obj = mqb.having('name', 'Nik');
    assert(Array.isArray(mqb._having));
    assert.equal(mqb._having.length, 1);
    assert.equal(mqb._having[0].field, 'name');
    assert.equal(mqb._having[0].value, 'Nik');
    assert.equal(mqb._having[0].booleanOperator, 'AND');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('having (field = object)', function() {
    const obj = mqb.having({name: 'Nik'});
    assert(Array.isArray(mqb._having));
    assert.equal(mqb._having.length, 1);
    assert.equal(mqb._having[0].field, 'name');
    assert.equal(mqb._having[0].value, 'Nik');
    assert.equal(mqb._having[0].booleanOperator, 'AND');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('having (field = object, booleanOperator = string)', function() {
    const obj = mqb.having({name:'Nik', total: 10}, 'or');

    assert(Array.isArray(mqb._having));
    assert.equal(mqb._having.length, 2);
    assert.equal(mqb._having[0].field, 'name');
    assert.equal(mqb._having[0].value, 'Nik');
    assert.equal(mqb._having[0].booleanOperator, 'OR');
    assert.equal(mqb._having[1].field, 'total');
    assert.equal(mqb._having[1].value, 10);
    assert.equal(mqb._having[1].booleanOperator, 'OR');

    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('having (field = string) throwing error', function() {
    expect(() => { mqb.having('name'); }).to.throw("HAVING: no value for having passed");
  });


  it('having() throwing error', function() {
    expect(() => { mqb.having(); }).to.throw("HAVING: no arguments passed");
  });
});
