'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;

let MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();

beforeEach(function(done) {
  mqb.reset();
  done();
});

describe('like', function() {
  it('like (field, query)', function() {
    const obj = mqb.like('name', 'Nik');
    assert(Array.isArray(mqb._like));
    assert.equal(mqb._like.length, 1);
    assert.equal(mqb._like[0].field, 'name');
    assert.equal(mqb._like[0].query, 'Nik');
    assert.equal(mqb._like[0].type, 'both');
    assert.equal(mqb._like[0].or, false);

    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
  it('like (field, query, type = before)', function() {
    const obj = mqb.like('name', 'Nik', 'before');
    assert(Array.isArray(mqb._like));
    assert.equal(mqb._like.length, 1);
    assert.equal(mqb._like[0].field, 'name');
    assert.equal(mqb._like[0].query, 'Nik');
    assert.equal(mqb._like[0].type, 'before');
    assert.equal(mqb._like[0].or, false);

    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('like (field, query, type = after)', function() {
    const obj = mqb.like('name', 'Nik', 'after');
    assert(Array.isArray(mqb._like));
    assert.equal(mqb._like.length, 1);
    assert.equal(mqb._like[0].field, 'name');
    assert.equal(mqb._like[0].query, 'Nik');
    assert.equal(mqb._like[0].type, 'after');
    assert.equal(mqb._like[0].or, false);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('like (field, query, type = before)', function() {
    const obj = mqb.like('name', 'Nik', 'before');
    assert(Array.isArray(mqb._like));
    assert.equal(mqb._like.length, 1);
    assert.equal(mqb._like[0].field, 'name');
    assert.equal(mqb._like[0].query, 'Nik');
    assert.equal(mqb._like[0].type, 'before');
    assert.equal(mqb._like[0].or, false);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('like (field, query, type = after, or = true)', function() {
    const obj = mqb.like('name', 'Nik', 'after', true);
    assert(Array.isArray(mqb._like));
    assert.equal(mqb._like.length, 1);
    assert.equal(mqb._like[0].field, 'name');
    assert.equal(mqb._like[0].query, 'Nik');
    assert.equal(mqb._like[0].type, 'after');
    assert.equal(mqb._like[0].or, true);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('likeOR (field, query)', function() {
    const obj = mqb.likeOR('name', 'Nik');
    assert(Array.isArray(mqb._like));
    assert.equal(mqb._like.length, 1);
    assert.equal(mqb._like[0].field, 'name');
    assert.equal(mqb._like[0].query, 'Nik');
    assert.equal(mqb._like[0].type, 'both');
    assert.equal(mqb._like[0].or, true);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('likeOR (field, query, type = after)', function() {
    const obj = mqb.likeOR('name', 'Nik', 'after');
    assert(Array.isArray(mqb._like));
    assert.equal(mqb._like.length, 1);
    assert.equal(mqb._like[0].field, 'name');
    assert.equal(mqb._like[0].query, 'Nik');
    assert.equal(mqb._like[0].type, 'after');
    assert.equal(mqb._like[0].or, true);
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('from (table == undefined) throwing error', function() {
    expect(() => { mqb.from(); }).to.throw("From: Table is undefined");
  });
});
