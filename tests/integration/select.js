'use strict';
var assert = require('chai').assert;
var MySQLQueryBuilder = require('../../index.js');
var mqb = new MySQLQueryBuilder();
var mocks = require('../mocks.js');

var SQL = "";

describe('SELECT', function() {
  it('Simple: ' + mocks.SELECT[1], function() {
    var sql = mqb.select('id, name').from('table').where('id', 5).build();
    assert.equal(mocks.SELECT[1], sql);
  });

  it('JOIN: ' + mocks.SELECT[2], function() {
    var sql = mqb.select('t1.id, t1.name, t2.email').from('table1 as t1').join('table2 as t2', 't2.userId=t1.id').where('t1.id', 5).build();
    assert.equal(mocks.SELECT[2], sql);
  });

  it('JOIN LEFT: ' + mocks.SELECT[3], function() {
    var sql = mqb.select('t1.id, t1.name, t2.email').from('table1 as t1').join('table2 as t2', 't2.userId=t1.id', 'left').where('t1.id', 5).build();
    assert.equal(mocks.SELECT[3], sql);
  });

  it('JOIN RIGHT: ' + mocks.SELECT[4], function() {
    var sql = mqb.select('t1.id, t1.name, t2.email').from('table1 as t1').join('table2 as t2', 't2.userId=t1.id', 'right').where('t1.id', 5).build();
    assert.equal(mocks.SELECT[4], sql);
  });

  it('JOIN INNER: ' + mocks.SELECT[5], function() {
    var sql = mqb.select('t1.id, t1.name, t2.email').from('table1 as t1').join('table2 as t2', 't2.userId=t1.id', 'inner').where('t1.id', 5).build();
    assert.equal(mocks.SELECT[5], sql);
  });

  it('JOIN 2x tables: ' + mocks.SELECT[6], function() {
    var sql = mqb.select('t1.id, t1.name, t2.email, t3.school').from('table1 as t1')
      .join('table2 as t2', 't2.userId=t1.id', 'inner')
      .join('table3 as t3', 't3.userId=t1.id', 'left')
      .where('t1.id', 5).build();
    assert.equal(mocks.SELECT[6], sql);
  });

  it('JOIN 3x tables: ' + mocks.SELECT[7], function() {
    var sql = mqb.select('t1.id, t1.name, t2.email, t3.school, t4.nikname')
      .from('table1 as t1')
      .join('table2 as t2', 't2.userId=t1.id', 'inner')
      .join('table3 as t3', 't3.userId=t1.id', 'left')
      .join('table4 as t4', 't4.userId=t1.id', 'right')
      .where('t1.id', 5).build();
    assert.equal(mocks.SELECT[7], sql);
  });

  it('WHERE multiple: ' + mocks.SELECT[8], function() {
    var sql = mqb.select('id, name')
      .from('table1')
      .where('id', 5)
      .where('name', 'Nik')
      .build();
    assert.equal(mocks.SELECT[8], sql);
  });

  it('WHERE object: ' + mocks.SELECT[8], function() {
    var sql = mqb.select('id, name')
      .from('table1')
      .where({ id:5, name: 'Nik'})
      .build();
    assert.equal(mocks.SELECT[8], sql);
  });

  it('WHERE OR: ' + mocks.SELECT[9], function() {
    var sql = mqb.select('id, name').from('table1')
      .where({ id:5, name: 'Nik'})
      .whereOR('title', 'Lucky')
      .build();
    assert.equal(mocks.SELECT[9], sql);
  });

  it('WHERE NOT: ' + mocks.SELECT[10], function() {
    var sql = mqb.select('id, name').from('table1')
      .where('name !=', 'Lucky')
      .build();
    assert.equal(mocks.SELECT[10], sql);
  });

  it('LIMIT: ' + mocks.SELECT[11], function() {
    var sql = mqb.select('id, name').from('table1')
      .limit(0, 100)
      .build();
    assert.equal(mocks.SELECT[11], sql);
  });

  it('SET TABLE: ' + mocks.SELECT[12], function() {
    mqb.setTable('table1');
    var sql = mqb.select('id, name').build();
    assert.equal(mocks.SELECT[12], sql);
  });

  it('ORDER BY: ' + mocks.SELECT[13], function() {
    var sql = mqb.select('id, name').from('table1')
      .limit(0, 100)
      .orderBy('name', 'asc')
      .build();
    assert.equal(mocks.SELECT[13], sql);
  });
});
