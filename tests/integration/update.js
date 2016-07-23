'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;
var MySQLQueryBuilder = require('../../index.js');
var mqb = new MySQLQueryBuilder();
var mocks = require('../mocks.js');

describe('UPDATE', function() {
  it('update(table, values): ' + mocks.UPDATE[1], function() {
    var sql = mqb.update('table1', { id: 1, name: 'Nik' }).build();
    assert.equal(mocks.UPDATE[1], sql);
  });

  it('update(table, values) + where: ' + mocks.UPDATE[2], function() {
    var sql = mqb.update('table1', { id: 1, name: 'Nik' }).where('id', 1).build();
    assert.equal(mocks.UPDATE[2], sql);
  });

  it('update(table, values) + where + setTable: ' + mocks.UPDATE[2], function() {
    mqb.setTable('table1')
    var sql = mqb.update({ id: 1, name: 'Nik' }).where('id', 1).build();
    assert.equal(mocks.UPDATE[2], sql);
  });

  it('update() throwing error', function() {
    expect(() => { mqb.update(); }).to.throw("Update: Table is undefined");
  });
  it('update(undefined, data) throwing error', function() {
    expect(() => { mqb.update(undefined, {id: 1}); }).to.throw("Table is undefined");
  });

  it('update(table1, undefined) throwing error', function() {
    expect(() => { mqb.update('table1', undefined); }).to.throw("Update: Data is not object");
  });
});
