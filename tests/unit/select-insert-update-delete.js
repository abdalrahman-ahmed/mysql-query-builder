var assert = require('chai').assert;
var expect = require('chai').expect;

let MySQLQueryBuilder = require('../../index.js');
let mqb = new MySQLQueryBuilder();
beforeEach(function(done) {
  mqb.reset();
  done();
});

describe('Tables', function() {
  it('setTable', function() {
    const obj = mqb.setTable('table1');
    assert.equal(mqb._table, 'table1');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
});

describe('select', function() {
  it('select (fields as string)', function() {
    const obj = mqb.select('id, name');
    assert.equal(mqb._fields, 'id, name');
    assert.equal(mqb._queryType, 'select');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
  it('select (fields as null)', function() {
    const obj = mqb.select();
    assert.equal(mqb._fields, null);
    assert.equal(mqb._queryType, 'select');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
  it('select (fields as array)', function() {
    const obj = mqb.select(['id', 'name']);
    assert(Array.isArray(mqb._fields), 'is array');
    assert.equal(mqb._fields.length, 2);
    assert.equal(mqb._fields[0], 'id');
    assert.equal(mqb._fields[1], 'name');
    assert.equal(mqb._queryType, 'select');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });
});

describe('insert', function() {
  it('insert (table, fields, data)', function() {
    const obj = mqb.insert('table1', ['id', 'name'], { id: 1, name: 'Nik' });
    assert.equal(mqb._queryType, 'insert');
    assert.equal(mqb._table, 'table1');
    assert(Array.isArray(mqb._fields), 'is array');
    assert.equal(mqb._fields.length, 2);
    assert.equal(Object.keys(mqb._values).length, 2);
    assert.equal(mqb._fields[0], 'id');
    assert.equal(mqb._fields[1], 'name');
    assert.equal(mqb._values.id, 1);
    assert.equal(mqb._values.name, 'Nik');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('insert (table, data)', function() {
    const obj = mqb.insert('table1', { id: 1, name: 'Nik' });
    assert.equal(mqb._queryType, 'insert');
    assert.equal(mqb._table, 'table1');
    assert(Array.isArray(mqb._fields), 'is array');
    assert.equal(mqb._fields.length, 2);
    assert.equal(Object.keys(mqb._values).length, 2);
    assert.equal(mqb._fields[0], 'id');
    assert.equal(mqb._fields[1], 'name');
    assert.equal(mqb._values.id, 1);
    assert.equal(mqb._values.name, 'Nik');
    assert(obj instanceof MySQLQueryBuilder, 'return this');
  });

  it('insert (table, data == undefined) throwing error', function() {
    expect(() => { mqb.insert('table1'); }).to.throw("Insert data is empty");
  });

  it('insert (table == undefined) throwing error', function() {
    expect(() => { mqb.insert(); }).to.throw("Table is undefined");
  });
});

  describe('update', function() {
    it('update (table, data)', function() {
      const obj = mqb.update('table1', { id: 1, name: 'Nik' });
      assert.equal(mqb._queryType, 'update');
      assert.equal(mqb._table, 'table1');
      assert(typeof mqb._values === 'object', 'is object');
      assert.equal(Object.keys(mqb._values).length, 2);
      assert.equal(mqb._values.id, 1);
      assert.equal(mqb._values.name, 'Nik');
      assert(obj instanceof MySQLQueryBuilder, 'return this');
    });

    it('update (data) - no table set', function() {
      const obj = mqb.update({ id: 1, name: 'Nik' });
      assert.equal(mqb._queryType, 'update');
      assert.equal(mqb._table, null);

      assert(typeof mqb._values === 'object', 'is object');
      assert.equal(Object.keys(mqb._values).length, 2);
      assert.equal(mqb._values.id, 1);
      assert.equal(mqb._values.name, 'Nik');
      assert(obj instanceof MySQLQueryBuilder, 'return this');
    });

    it('update (data) - table set to table1', function() {
      mqb.setTable('table1');
      const obj = mqb.update({ id: 1, name: 'Nik' });
      assert.equal(mqb._queryType, 'update');
      assert.equal(mqb._table, 'table1');

      assert(typeof mqb._values === 'object', 'is object');
      assert.equal(Object.keys(mqb._values).length, 2);
      assert.equal(mqb._values.id, 1);
      assert.equal(mqb._values.name, 'Nik');
      assert(obj instanceof MySQLQueryBuilder, 'return this');
    });

    it('update (table, data == undefined) throwing error', function() {
      expect(() => { mqb.update('table1'); }).to.throw("Update: Data is undefined");
    });

    it('update (table == undefined, data == undefined) throwing error', function() {
      expect(() => { mqb.update(); }).to.throw("Update: Data is undefined");
    });
  });

  describe('delete', function() {
    it('delete (table, where)', function() {
      const obj = mqb.delete('table1', { id: 1 });
      assert.equal(mqb._queryType, 'delete');
      assert.equal(mqb._table, 'table1');
      assert(typeof mqb._where === 'object', 'is object');
      assert.equal(Object.keys(mqb._where).length, 1);
      assert.equal(mqb._where.id, 1);
      assert(obj instanceof MySQLQueryBuilder, 'return this');
    });

    it('delete (table, where == undefined)', function() {
      const obj = mqb.delete('table1');
      assert.equal(mqb._queryType, 'delete');
      assert.equal(mqb._table, 'table1');
      assert.equal(mqb._where.length, 0);
      assert(Array.isArray(mqb._where), 'is array');

      assert(obj instanceof MySQLQueryBuilder, 'return this');
    });

    it('delete (table == undefined, data == undefined)', function() {
      const obj = mqb.delete();
      assert.equal(mqb._queryType, 'delete');
      assert.equal(mqb._table, undefined);
      assert.equal(mqb._where.length, 0);
      assert(Array.isArray(mqb._where), 'is array');

      assert(obj instanceof MySQLQueryBuilder, 'return this');
    });
  });
