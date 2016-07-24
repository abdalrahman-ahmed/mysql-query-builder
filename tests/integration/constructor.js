'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;
var MySQLQueryBuilder = require('../../index.js');
var mocks = require('../mocks.js');

describe('Query Builder constructor ', function() {
  it('constructor()', function() {
    var mqb = new MySQLQueryBuilder();
    assert.equal(mqb.queries.length, 0);
    assert.equal(mqb.dbConfig, undefined);
    assert.equal(mqb.dbConnection, undefined);
    assert(mqb instanceof MySQLQueryBuilder, true);
  });

  it('constructor(dbConfig)', function() {
    var mqb = new MySQLQueryBuilder(mocks.DB.config);
    assert(mqb instanceof MySQLQueryBuilder, true);
    assert.equal(mqb.queries.length, 0);
    assert.equal(typeof mqb.dbConfig, 'object');
    assert.equal(mqb.dbConfig.host, '127.0.0.1');
    assert.equal(mqb.dbConnection, undefined);
  });

  it('constructor(dbConnection)', function() {
    var mqb = new MySQLQueryBuilder(mocks.DB.connection);
    assert(mqb instanceof MySQLQueryBuilder, true);
    assert.equal(mqb.queries.length, 0);
    assert.equal(mqb.dbConfig, undefined);
    assert.equal(typeof mqb.dbConnection, 'object');
    assert.equal(mqb.dbConnection.state, false);
    assert.equal(typeof mqb.dbConnection.connect, 'function');
  });

});
