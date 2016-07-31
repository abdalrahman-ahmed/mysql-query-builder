'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var DbAdapter = require('../../src/db-adapter.js');
var dba = null;
var mocks = require('./../mocks');

beforeEach(function(done) {

  done();
});

describe('DBAdapter', function() {
  it('constructor() empty', function() {
    try {
      dba = new DbAdapter();
      assert(dba instanceof DbAdapter);
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }
  });

  it('constructor( mysql ) - mysql module installation check', function() {
    try {
      dba = new DbAdapter('mysql');
      assert(dba instanceof DbAdapter);
      assert.equal(dba.getDbType(), 'mysql');
      assert(typeof dba.getAdapter() === 'object');
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }
  });

  it('setDbType() empty - mysql', function() {
    try {
      dba = new DbAdapter().setDbType();
      assert.equal(dba.getDbType(), 'mysql');
      assert(typeof dba.getAdapter() === 'object');
      assert(dba instanceof DbAdapter);
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }

  });

  it('getDbType()', function() {
    try {
      dba = new DbAdapter();
      var obj = dba.getDbType();
      assert.equal(dba.getDbType(), 'mysql');
      assert(typeof dba.getAdapter() === 'object');
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }
  });

  it('getAdapter() - + mysql module installation check', function() {
    try {
      dba = new DbAdapter();
      assert(dba instanceof DbAdapter);
      assert(typeof dba.getAdapter() === 'object');
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }
  });

  it('setConnection() - invalid', function() {
    try{
      expect(() => { new DbAdapter().setConnection() }).to.throw("Connection is not valid object");
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }
  });

  it('setConnection() - valid', function() {
    try {
      dba = new DbAdapter();
      dba.setConnection(mocks.DB.connection);
      assert(typeof dba.getConnection() === 'object');
      assert(typeof dba.getConfig() === 'object');
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }
  });

  it('getConnection() - valid', function() {
    try {
      dba = new DbAdapter();
      dba.setConnection(mocks.DB.connection);
      var connection = dba.getConnection();
      assert(typeof connection === 'object');
      assert(typeof connection.config === 'object');
      assert(typeof connection.connect === 'function');
      assert.equal(connection.state, false);
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }
  });

  it('setConfig()', function() {
    try {
      dba = new DbAdapter();
      dba.setConfig(mocks.DB.config);
      assert(dba.setConfig(mocks.DB.config) instanceof DbAdapter);
    }catch(e){
      expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
    }
  });

    it('getConfig()', function() {
      try {
        dba = new DbAdapter();
        dba.setConfig(mocks.DB.config);
        var config = dba.getConfig();
        assert(typeof config === 'object');
        assert.equal(config.host, '127.0.0.1');
        assert.equal(config.user, 'root');
      }catch(e){
        expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
      }
    });

    it('checkConnection() - valid', function() {
      try {
        dba = new DbAdapter();
        dba.setConnection(mocks.DB.connection);
        var connection = dba.checkConnectionStatus();
        assert(typeof connection === 'object');
        assert(typeof connection.config === 'object');
        assert(typeof connection.connect === 'function');
        assert.equal(connection.state, false);
      }catch(e){
        expect(() => { new DbAdapter('mysql') }).to.throw("Cannot find module \'mysql\'");
      }
    });

});
