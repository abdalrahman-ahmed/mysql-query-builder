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
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
  it('from (table == undefined) throwing error', function() {
    expect(() => { mqb.from(); }).to.throw("From: Table is undefined");
  });
});
