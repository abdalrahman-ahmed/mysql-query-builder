'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;

const MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();

const mocks = require('../mocks.js');


beforeEach(function(done) {
  mqb.reset();
  mqb.queries = [];
  done();
});

describe('Working with queries', function() {
  it('Initial', function() {
    assert(Array.isArray(mqb.queries));
    assert.equal(mqb.queries.length, 0);
  });

  it('getQueries(): Adding query after build()', function() {
    const obj = mqb.select('id, name').from('table1');
    assert(Array.isArray(mqb.getQueries()));
    assert.equal(mqb.getQueries().length, 0);
    obj.build();
    assert(Array.isArray(mqb.getQueries()));
    assert.equal(mqb.getQueries().length, 1);
  });

  it('getLastQuery()', function() {
    mqb.select('id, name').from('table1').build();
    assert(Array.isArray(mqb.getQueries()));
    assert.equal(mqb.getQueries().length, 1);
    let query = mqb.getLastQuery();
    assert.equal(query.query, mocks.SELECT[12]);
    assert.equal(query.executed, false);
    assert.equal(query.queryTime, 0);
    assert.equal(query.id, 1);

    mqb.select('firstName, lastName').from('table2').build();
    assert.equal(mqb.getQueries().length, 2);
    query = mqb.getLastQuery();
    assert.equal(query.query, mocks.SELECT[14]);
    assert.equal(query.executed, false);
    assert.equal(query.queryTime, 0);
    assert.equal(query.id, 2);
  });

  it('getLastQuery() empty array', function() {
    assert(Array.isArray(mqb.getQueries()));
    assert.equal(mqb.getQueries().length, 0);
    let query = mqb.getLastQuery();
    assert.equal(query, null);
  });

  it('setQuery(string)', function() {

    assert(Array.isArray(mqb.getQueries()));
    assert.equal(mqb.getQueries().length, 0);

    const SQL = mqb.select('id, name').from('table1').build();
    mqb.setQuery(SQL);
    let query = mqb.getLastQuery();
    assert.equal(query.query, mocks.SELECT[12]);
    assert.equal(query.executed, false);
    assert.equal(query.queryTime, 0);
    assert.equal(query.id, 2);
  });

  it('setQuery() throwing error if SQL is not a string', function() {
    expect(() => { mqb.setQuery(); }).to.throw("setQuery: SQL is not a string");
  });

  it('getQuery() no querries', function() {
    expect(() => { mqb.getQuery(); }).to.throw("Exec: No query to execute");
  });

  it('exec() no querries', function() {
    expect(() => { mqb.exec(); }).to.throw("Exec: Nor database config neither connection is specified. Execution is aborted");
  });

});
