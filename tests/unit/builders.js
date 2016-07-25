// afterBuild
// build - empty
// buildWhere
// buildLike
// buildJoin
// buildLimit
// buildOrderBy
// buildGroupBy
// getTableFields
// collectParams
'use strict';
var assert = require('chai').assert;
var expect = require('chai').expect;

const MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();

const mocks = require('../mocks.js');


beforeEach(function(done) {
  mqb.reset();
  done();
});

describe('Builders', function() {
  it('afterBuild() throwing error if SQL is not a string', function() {
    expect(() => { mqb.afterBuild(); }).to.throw("After build: SQL is not string. undefined");
  });

  it('afterBuild(SQL): Adding query after build()', function() {
    const SQL = mocks.SELECT[1];
    mqb.afterBuild(SQL);
    assert.equal(mqb.getQueries().length, 1);
    const lastQuery = mqb.getLastQuery();
    assert.equal(lastQuery.query, SQL + ';'); // Do not forget  - it adds ; at the end of the query
    assert.equal(lastQuery.executed, false);
    assert.equal(lastQuery.queryTime, 0);
    assert.equal(lastQuery.id, 1);
    // Checking reset
    assert.equal(mqb._where.length, 0);
    assert.equal(mqb._table, null);
    assert.equal(mqb._join.length, 0);
    assert.equal(mqb._fields, null);
    assert.equal(mqb._values, null);
    assert.equal(mqb._orderBy.length, 0);
    assert.equal(mqb._groupBy, null);
    assert.equal(mqb._queryType, null);
    assert(Array.isArray(mqb._limit));
    assert.equal(mqb._limit[0], 0);
    assert.equal(mqb._limit[1], 1000);
    assert.equal(mqb._like.length, 0);
  });

  it('build() throwing error if query type is not defined', function() {
    expect(() => { mqb.build(); }).to.throw("Query type null is not supported");
  });

  it('buildWhere() _where is empty array', function() {
    assert.equal(mqb.buildWhere(), "");
  });
  it('buildWhere() 1', function() {
    mqb.where('id', 1);
    assert.equal(mqb.buildWhere(), "`id`=1");
  });
  it('buildWhere() 2', function() {
    mqb.where('id', 1).where('name', 'Nik');
    assert.equal(mqb.buildWhere(), "`id`=1 AND `name`='Nik'");
  });
  it('buildWhere() 3', function() {
    mqb.where({id: 1, name: 'Nik'});
    assert.equal(mqb.buildWhere(), "`id`=1 AND `name`='Nik'");
  });
  it('buildWhere() 3', function() {
    mqb.where({id: 1, name: 'Nik'}).whereOR('email', 'iam@niklucky.com');
    assert.equal(mqb.buildWhere(), "`id`=1 AND `name`='Nik' OR `email`='iam@niklucky.com'");
  });

  it('buildLike() _like is empty array', function() {
    assert.equal(mqb.buildLike(), "");
  });
  it('buildLike() 1', function() {
    mqb.like('id', 1);
    assert.equal(mqb.buildLike(), "id LIKE '%1%'");
  });
  it('buildLike() 2', function() {
    mqb.like('id', 1).like('name', 'Nik');
    assert.equal(mqb.buildLike(), "id LIKE '%1%' AND name LIKE '%Nik%'");
  });
  it('buildLike() 4', function() {
    mqb.like('id', 1).like('name', 'Nik', 'before', true);
    assert.equal(mqb.buildLike(), "id LIKE '%1%' OR name LIKE '%Nik'");
  });
  it('buildLike() 5', function() {
    mqb.like('id', 1).likeOR('name', 'Nik', 'after');
    assert.equal(mqb.buildLike(), "id LIKE '%1%' OR name LIKE 'Nik%'");
  });

  it('buildJoin() _join is empty array', function() {
    assert.equal(mqb.buildJoin(), "");
  });
  it('buildJoin() 1', function() {
    mqb.join('table2', 'table2.id=table1.id');
    assert.equal(mqb.buildJoin(), "  JOIN table2 ON table2.id=table1.id");
  });
  it('buildJoin() 2', function() {
    mqb
      .join('table2', 'table2.id=table1.id')
      .join('table3', 'table3.id=table1.id');
    assert.equal(mqb.buildJoin(), "  JOIN table2 ON table2.id=table1.id  JOIN table3 ON table3.id=table1.id");
  });

  it('buildJoin() 3', function() {
    mqb
      .join('table2', 'table2.id=table1.id', 'left')
      .join('table3', 'table3.id=table1.id', 'right')
      .join('table4', 'table4.id=table1.id', 'inner');
    assert.equal(mqb.buildJoin(), " LEFT JOIN table2 ON table2.id=table1.id RIGHT JOIN table3 ON table3.id=table1.id INNER JOIN table4 ON table4.id=table1.id");
  });

  it('buildLimit()', function() {
    mqb._limit = null;
    assert.equal(mqb.buildLimit(), "");
  });
  it('buildLimit()', function() {
    assert.equal(mqb.buildLimit(), " LIMIT 0, 1000");
  });

  it('buildOrderBy()', function() {
    assert.equal(mqb.buildOrderBy(), "");
  });
  it('buildOrderBy()', function() {
    mqb.orderBy('name');
    assert.equal(mqb.buildOrderBy(), " ORDER BY name ASC");
  });
  it('buildOrderBy()', function() {
    mqb.orderBy('name', 'desc');
    assert.equal(mqb.buildOrderBy(), " ORDER BY name desc");
  });

  it('buildGroupBy()', function() {
    assert.equal(mqb.buildGroupBy(), "");
  });
  it('buildGroupBy()', function() {
    mqb.groupBy('name');
    assert.equal(mqb.buildGroupBy(), " GROUP BY name");
  });

  it('getTableFields(string)', function() {
    let fields = mqb.getTableFields('table');
    assert.equal(fields[0], "table.*");
  });
  it('getTableFields(string as)', function() {
    let fields = mqb.getTableFields('table as t');
    assert.equal(fields[0], " t.*");
  });

  it('collectParams() with empty table', function() {
    expect(() => { mqb.collectParams(); }).to.throw("You need to specify table");
  });
  it('collectParams() table', function() {
    mqb.from('table1');
    let params = mqb.collectParams();
    assert.equal(params.from, "table1");
    assert.equal(params.fields, "table1.*");
    assert.equal(params.where.length, 0);
    assert.equal(params.join.length, 0);
  });
  it('collectParams() table, fields', function() {
    mqb.from('table1').select('id, name');
    let params = mqb.collectParams();
    assert.equal(params.from, "table1");
    assert.equal(params.fields, "id, name");
    assert.equal(params.where.length, 0);
    assert.equal(params.join.length, 0);
  });
  it('collectParams() table, fields, where', function() {
    mqb.from('table1').select('id, name').where('id', 1);
    let params = mqb.collectParams();
    assert.equal(params.from, "table1");
    assert.equal(params.fields, "id, name");
    assert.equal(params.where.length, 1);
    assert.equal(params.join.length, 0);
  });
  it('collectParams() table, fields, where, join', function() {
    mqb.from('table1').select('id, name').where('id', 1).join('table2', 'table2.id=table1.id');
    let params = mqb.collectParams();
    assert.equal(params.from, "table1");
    assert.equal(params.fields, "id, name");
    assert.equal(params.where.length, 1);
    assert.equal(params.join.length, 1);
  });

  it('buildHaving(): field, value', function() {
    mqb.having('name', 'Nik');
    assert.equal(mqb.buildHaving(), " HAVING  `name` = 'Nik'");
  });

  it('buildHaving(): pupe field, value, booleanOperator', function() {
    mqb.having('name', 'Nik').having('total', 10, 'or');
    assert.equal(mqb.buildHaving(), " HAVING  `name` = 'Nik'  OR `total` = 10");
  });

  it('buildHaving() object', function() {
    mqb.having({name: 'Nik', total: 10});
    assert.equal(mqb.buildHaving(), " HAVING  `name` = 'Nik'  AND `total` = 10");
  });

  it('buildHaving() 2 objects', function() {
    mqb.having({name: 'Nik', total: 10}, 'or');
    assert.equal(mqb.buildHaving(), " HAVING  `name` = 'Nik'  OR `total` = 10");
  });
  it('buildHaving() 3 objects', function() {
    mqb.having({name: 'Nik', total: 10}, 'or').having({ subTotal: 5}, 'or');
    assert.equal(mqb.buildHaving(), " HAVING  `name` = 'Nik'  OR `total` = 10  OR `subTotal` = 5");
  });
});
