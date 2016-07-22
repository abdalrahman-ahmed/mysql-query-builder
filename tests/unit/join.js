var assert = require('chai').assert;
var expect = require('chai').expect;

let MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();

beforeEach(function(done) {
  mqb.reset();
  done();
});

describe('join', function() {
  it('join (table, on)', function() {
    const obj = mqb.join('table2', 'table2.id=table1.id');
    assert(Array.isArray(mqb._join));
    assert.equal(mqb._join.length, 1);
    assert.equal(mqb._join[0].table, 'table2');
    assert.equal(mqb._join[0].on, 'table2.id=table1.id');
    assert.equal(mqb._join[0].type, '');

    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('join (table, on, type=left)', function() {
    const obj = mqb.join('table2', 'table2.id=table1.id', 'left');
    assert(Array.isArray(mqb._join));
    assert.equal(mqb._join.length, 1);
    assert.equal(mqb._join[0].table, 'table2');
    assert.equal(mqb._join[0].on, 'table2.id=table1.id');
    assert.equal(mqb._join[0].type, 'LEFT');

    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('join (table, on, type=right)', function() {
    const obj = mqb.join('table2', 'table2.id=table1.id', 'right');
    assert(Array.isArray(mqb._join));
    assert.equal(mqb._join.length, 1);
    assert.equal(mqb._join[0].table, 'table2');
    assert.equal(mqb._join[0].on, 'table2.id=table1.id');
    assert.equal(mqb._join[0].type, 'RIGHT');

    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('join (table, on, type=inner)', function() {
    const obj = mqb.join('table2', 'table2.id=table1.id', 'inner');
    assert(Array.isArray(mqb._join));
    assert.equal(mqb._join.length, 1);
    assert.equal(mqb._join[0].table, 'table2');
    assert.equal(mqb._join[0].on, 'table2.id=table1.id');
    assert.equal(mqb._join[0].type, 'INNER');

    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });


  it('join (table, on == undefined) throwing error', function() {
    expect(() => { mqb.join('table2'); }).to.throw("JOIN: you need to specify TABLE and ON for join");
  });
  it('join (table == undefined, on) throwing error', function() {
    expect(() => { mqb.join(undefined, 't1.id=t2.id'); }).to.throw("JOIN: you need to specify TABLE and ON for join");
  });
  it('join (table == undefined, on == undefined) throwing error', function() {
    expect(() => { mqb.join(); }).to.throw("JOIN: you need to specify TABLE and ON for join");
  });
});
