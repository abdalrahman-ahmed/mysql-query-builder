'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;
var MySQLQueryBuilder = require('../../index.js');
var mqb = new MySQLQueryBuilder();
var mocks = require('../mocks.js');

describe('INSERT', function() {
  it('insert(table, fields, values): ' + mocks.INSERT[1], function() {
    var sql = mqb.insert('table1', ['id', 'name'], { id: 1, name: 'Nik' }).build();
    assert.equal(mocks.INSERT[1], sql);
  });
  it('insert(table, values): ' + mocks.INSERT[1], function() {
    var sql = mqb.insert('table1', { id: 1, name: 'Nik' }).build();
    assert.equal(mocks.INSERT[1], sql);
  });
  it('insert(values): ' + mocks.INSERT[1], function() {
    mqb.setTable('table1');
    var sql = mqb.insert({ id: 1, name: 'Nik' }).build();
    assert.equal(mocks.INSERT[1], sql);
  });
  it('insert() throwing error', function() {
    expect(() => { mqb.insert(); }).to.throw("Insert: data is not provided");
  });
  it('insert(undefined, data) throwing error', function() {
    expect(() => { mqb.insert(undefined, {id: 1}); }).to.throw("Table is undefined");
  });
  it('insert(table1, undefined) throwing error', function() {
    expect(() => { mqb.insert('table1', undefined); }).to.throw("Insert data is empty");
  });
});
