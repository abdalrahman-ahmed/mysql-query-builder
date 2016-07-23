'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;
var MySQLQueryBuilder = require('../../index.js');
var mqb = new MySQLQueryBuilder();
var mocks = require('../mocks.js');

describe('DELETE', function() {
  it('delete(table, where): ' + mocks.DELETE[1], function() {
    var sql = mqb.delete('table1', { id: 1 }).build();
    assert.equal(mocks.DELETE[1], sql);
  });

  it('delete(table1) + where: ' + mocks.DELETE[1], function() {
    var sql = mqb.delete('table1').where('id', 1).build();
    assert.equal(mocks.DELETE[1], sql);
  });
  it('delete() + where + setTable: ' + mocks.DELETE[1], function() {
    mqb.setTable('table1');
    var sql = mqb.delete().where('id', 1).build();
    assert.equal(mocks.DELETE[1], sql);
  });

  it('delete(undefined) throwing error', function() {
    expect(() => { mqb.delete(undefined); }).to.throw("Delete: Table is undefined");
  });

});
