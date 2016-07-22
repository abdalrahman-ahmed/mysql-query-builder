var assert = require('chai').assert;
var expect = require('chai').expect;

let MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();
beforeEach(function(done) {
  mqb.resetQueryParams();
  done();
});

describe('from-where:', function() {
  describe('from', function() {
    it('setTable', function() {
      const obj = mqb.setTable('table1');
      assert.equal(mqb._table, 'table1');
      assert(obj instanceof MySQLQueryBuilder, 'return this');
    });
  });
});
