"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');

var DEFAULT_LIMIT = 1000;
var DEFAULT_ORDER = 'ASC';
var BOOLEAN_AND = 'AND';

var TYPE_SELECT = 'select';
var TYPE_INSERT = 'insert';
var TYPE_UPDATE = 'update';
var TYPE_DELETE = 'delete';

var dbAdapter = require(path.join(__dirname, '/src/db-adapter'));

/** Class representing a MySQLQueryBuilder. */

var MySQLQueryBuilder = function () {
  /**
   * Initializing config and connections. It is optional
   * Resets all fields
   * @param {object} db - MySQL connection object or simple config object in format of node mysql
   */
  function MySQLQueryBuilder(db) {
    _classCallCheck(this, MySQLQueryBuilder);

    this.setDb(db);
    this.reset();
    this.queries = [];
  }
  /**
  * Checking type of object passed as db.
  * dbConfig  - checking by host property in object
  * dbConnection - checking connect() method
  * @param {object} db
  * @return {boolean}
  */


  _createClass(MySQLQueryBuilder, [{
    key: 'setDb',
    value: function setDb(db) {
      if ((typeof db === 'undefined' ? 'undefined' : _typeof(db)) === 'object') {
        if (db.connect !== undefined && typeof db.connect === 'function') {
          this.dbConnection = db;
          return true;
        }
        if (db.host !== undefined) {
          this.dbConfig = db;
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'getQuery',
    value: function getQuery(query) {
      if (query === undefined) {
        query = this.getLastQuery();
      }
      if (query === null) {
        throw new Error("Exec: No query to execute");
      }
      if (typeof query === 'string') {
        this.setQuery(query);
        query = this.getLastQuery();
      }
      return query;
    }
    /**
     * Executes a passed query or gets query from getLastQuery
     * @param {string} query - Optional. The string containing SQL-query.
     * @return {Promise} A new Promise object or a null
     */

  }, {
    key: 'exec',
    value: function exec(query) {
      if (this.dbConnection === undefined && this.dbConfig === undefined) {
        throw new Error("Exec: Nor database config neither connection is specified. Execution is aborted");
      }
      query = this.getQuery(query);
      var db = new dbAdapter('mysql');

      if (this.dbConnection === undefined) {
        this.dbConnection = db.setConfig(this.dbConfig).connect();
      }
      db.setConnection(this.dbConnection);

      return new Promise(function (resolve, reject) {
        return db.exec(query.query).then(function (result) {
          query.executed = true;
          resolve(result);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'getLastQuery',
    value: function getLastQuery() {
      var queries = this.getQueries();
      if (queries.length > 0) {
        return queries[queries.length - 1];
      }
      return null;
    }
  }, {
    key: 'getQueries',
    value: function getQueries() {
      return this.queries;
    }
  }, {
    key: 'setTable',
    value: function setTable(table) {
      this._table = table;
      return this;
    }
  }, {
    key: 'select',
    value: function select() {
      var fields = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this._queryType = TYPE_SELECT;
      this._fields = fields;
      return this;
    }
  }, {
    key: 'insert',
    value: function insert() {
      this._queryType = TYPE_INSERT;
      var table = void 0,
          fields = void 0,
          data = undefined;

      if (arguments.length === 0) {
        throw new Error("Insert: data is not provided");
      }

      if (arguments.length === 1) {
        if (this._table === null) {
          throw new Error("Insert: table is not provided");
        }
        this._values = arguments[0];
      }

      if (arguments.length === 2) {
        this._table = arguments[0];
        this._values = arguments[1];
      }
      if (arguments.length === 3) {
        this._table = arguments[0];
        this._fields = arguments[1];
        this._values = arguments[2];
      }

      if (typeof this._table !== 'string') {
        throw new Error("Table is undefined");
      }

      if (_typeof(this._values) !== 'object') {
        throw new Error("Insert data is empty");
      }

      if (this._fields === null) {
        this._fields = Object.keys(this._values);
      }

      return this;
    }
  }, {
    key: 'update',
    value: function update() {
      if (arguments.length === 0) {
        if (typeof this._table !== 'string') {
          throw new Error("Update: Table is undefined");
        }
        throw new Error("Update: Data is undefined");
      }
      if (arguments.length === 2) {
        this.setTable(arguments[0]);
        if (typeof this._table !== 'string') {
          throw new Error("Update: Table is undefined");
        }
        if (_typeof(arguments[1]) !== 'object') {
          throw new Error("Update: Data is not object");
        }

        this._queryType = TYPE_UPDATE;
        this._values = arguments[1];
        return this;
      }

      if (typeof this._table !== 'string') {
        throw new Error("Update: Table is undefined");
      }

      if (_typeof(arguments[0]) !== 'object') {
        throw new Error("Update: Data is undefined");
      }

      this._queryType = TYPE_UPDATE;
      this._values = arguments[0];
      return this;
    }
  }, {
    key: 'delete',
    value: function _delete() {
      this._queryType = TYPE_DELETE;

      if (arguments.length === 2) {
        this.setTable(arguments[0]);
        if (_typeof(arguments[1]) === 'object') {
          for (var i in arguments[1]) {
            this._where.push({
              key: i,
              value: arguments[1][i],
              or: false
            });
          }
        }
        return this;
      }
      if (arguments.length === 1) {
        if (typeof arguments[0] !== 'string') {
          throw new Error("Delete: Table is undefined");
        }
        this.setTable(arguments[0]);
      }
      return this;
    }
  }, {
    key: 'from',
    value: function from(_from) {
      if (typeof _from !== 'string') {
        throw new Error("From: Table is undefined");
      }
      this.setTable(_from);
      return this;
    }
  }, {
    key: 'where',
    value: function where(key, value) {
      if (key === undefined && value === undefined) {
        throw new Error("Where: nor key neither value is specified");
      }
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        return this.whereObject(key);
      }
      this._where.push({
        key: key,
        value: value,
        or: false
      });
      return this;
    }
  }, {
    key: 'whereObject',
    value: function whereObject(object) {
      if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
        throw new Error("Where: expected object got undefined");
      }
      for (var key in object) {
        if (!object.hasOwnProperty(key)) {
          continue;
        }
        var value = object[key];
        this._where.push({
          key: key,
          value: value,
          or: false
        });
      }
      return this;
    }
  }, {
    key: 'whereOR',
    value: function whereOR(key, value) {
      if (key === undefined && value === undefined) {
        throw new Error("Where OR: nor key neither value is specified");
      }
      if (value === undefined) {
        throw new Error("Where OR: value is undefined");
      }
      this._where.push({
        key: key,
        value: value,
        or: true
      });
      return this;
    }
  }, {
    key: 'like',
    value: function like(field, query) {
      var type = arguments.length <= 2 || arguments[2] === undefined ? 'both' : arguments[2];
      var or = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];


      this._like.push({
        field: field,
        query: query,
        type: type,
        or: or
      });
      return this;
    }
  }, {
    key: 'likeOR',
    value: function likeOR(field, query, type) {
      this.like(field, query, type, true);
      return this;
    }
  }, {
    key: 'join',
    value: function join(table, on) {
      var type = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

      if (typeof table !== 'string' || typeof on !== 'string') {
        throw new Error("JOIN: you need to specify TABLE and ON for join");
      }
      this._join.push({
        table: table,
        on: on,
        type: type.toUpperCase(type)
      });
      return this;
    }
  }, {
    key: 'limit',
    value: function limit() {
      var start = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var _limit = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_LIMIT : arguments[1];

      this._limit = [start, _limit];
      return this;
    }
  }, {
    key: 'orderBy',
    value: function orderBy(orderFields) {
      var order = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_ORDER : arguments[1];

      if (Array.isArray(orderFields)) {
        orderFields = orderFields.join(',');
      }
      if (typeof orderFields !== 'string') {
        throw new Error("ORDER BY: fields must be string or array");
      }
      this._orderBy.push({
        fields: orderFields,
        order: order
      });
      return this;
    }
  }, {
    key: 'groupBy',
    value: function groupBy(fields) {
      if (typeof fields !== 'string') {
        throw new Error("GROUP BY: fields must be string");
      }
      this._groupBy = fields;
      return this;
    }
  }, {
    key: 'having',
    value: function having() {
      var args = arguments;
      var having = {};
      var booleanOperator = BOOLEAN_AND;

      if (args.length === 0) {
        throw new Error("HAVING: no arguments passed");
      }

      if (args.length === 1) {
        if (_typeof(args[0]) !== 'object') {
          throw new Error("HAVING: no value for having passed");
        }
        having = args[0];
      }

      if (args.length === 2) {
        if (typeof args[0] === 'string') {
          having[args[0]] = args[1];
        }
        if (_typeof(args[0]) === 'object') {
          having = args[0];
          booleanOperator = args[1].toUpperCase();
        }
      }

      if (args.length === 3) {
        having[args[0]] = args[1];
        booleanOperator = args[2].toUpperCase();
      }

      for (var field in having) {
        this._having.push({
          field: field,
          value: having[field],
          booleanOperator: booleanOperator
        });
      }

      return this;
    }
  }, {
    key: 'build',
    value: function build() {
      if (this._queryType === TYPE_SELECT) {
        return this.buildSelectSQL();
      }

      if (this._queryType === TYPE_INSERT) {
        return this.buildInsertSQL();
      }

      if (this._queryType === TYPE_UPDATE) {
        return this.buildUpdateSQL();
      }

      if (this._queryType === TYPE_DELETE) {
        return this.buildDeleteSQL();
      }

      throw new Error("Query type " + this._queryType + " is not supported");
    }
  }, {
    key: 'afterBuild',
    value: function afterBuild(SQL) {
      if (typeof SQL !== 'string') {
        throw new Error("After build: SQL is not string. " + SQL);
      }
      SQL += ';';

      this.setQuery(SQL);
      this.reset();
      return SQL;
    }
  }, {
    key: 'buildInsertSQL',
    value: function buildInsertSQL() {
      var _this = this;

      var keys = this._fields.map(function (key) {
        return '`' + key + '`';
      }).join(',');
      var values = this._fields.map(function (key) {
        return '\'' + _this._values[key] + '\'';
      }).join(',');
      var SQL = 'INSERT INTO ' + this._table + ' (' + keys + ') VALUES (' + values + ')';
      return this.afterBuild(SQL);
    }
  }, {
    key: 'buildUpdateSQL',
    value: function buildUpdateSQL() {
      var where = this.buildWhere();
      var SQL = "UPDATE " + this._table + " SET ";
      var _set = [];
      for (var key in this._values) {
        if (!this._values.hasOwnProperty(key)) {
          continue;
        }
        _set.push('`' + key + '`=\'' + this._values[key] + '\'');
      }
      SQL += _set.join(',');
      SQL += " WHERE " + where;
      return this.afterBuild(SQL);
    }
  }, {
    key: 'buildDeleteSQL',
    value: function buildDeleteSQL() {
      var SQL = "DELETE FROM " + this._table + " WHERE " + this.buildWhere();
      return this.afterBuild(SQL);
    }
  }, {
    key: 'buildSelectSQL',
    value: function buildSelectSQL() {
      var params = this.collectParams();
      var where = "";

      if (this._where.length > 0 || this._like.length > 0) {
        where = this.buildWhere() + this.buildLike();
        if (where) {
          where = " WHERE " + where;
        }
      }

      var SQL = "SELECT " + params.fields + " " + "FROM " + params.from + this.buildJoin() + where + this.buildOrderBy() + this.buildGroupBy() + this.buildLimit();

      return this.afterBuild(SQL);
    }
  }, {
    key: 'buildWhere',
    value: function buildWhere() {
      var SQL = "";
      if (this._where.length > 0) {
        for (var i in this._where) {
          if (!this._where.hasOwnProperty(i)) {
            continue;
          }

          var expression = this._where[i];
          var expressionValue = '';

          if (SQL !== "") {
            if (expression.or) {
              SQL += " OR ";
            } else {
              SQL += " AND ";
            }
          }

          var sign = "=";
          if (expression.key.indexOf('!=') !== -1) {
            sign = "!=";
            expression.key = expression.key.replace('!=', '').trim();
          }

          if (_typeof(expression.value) === 'object') {
            sign = " IN ";
            for (var key in expression.value) {
              if (!this._where.hasOwnProperty(i)) {
                continue;
              }
              var value = expression.value[key];
              expressionValue = value;
              if (typeof value === "number") {} else {
                expression.value[key] = "'" + value + "'";
              }
            }
            expressionValue = "(" + expression.value.join(',') + ")";
          } else if (typeof expression.value === "number") {
            expressionValue = expression.value;
          } else {
            expressionValue = "'" + expression.value + "'";
          }

          SQL += '`' + expression.key + '`' + sign + expressionValue;
        }
      }

      return SQL;
    }
  }, {
    key: 'buildLike',
    value: function buildLike() {
      var SQL = "";
      if (this._like.length > 0) {
        for (var i in this._like) {
          if (!this._like.hasOwnProperty(i)) {
            continue;
          }
          var expression = this._like[i];
          if (SQL !== "") {
            if (expression.or) {
              SQL += " OR ";
            } else {
              SQL += " AND ";
            }
          }
          var value = "";
          if (expression.type === 'before' || expression.type === 'both') {
            value = "%";
          }
          value += expression.query;

          if (expression.type === 'after' || expression.type === 'both') {
            value += "%";
          }

          SQL += expression['field'] + " LIKE '" + value + "'";
        }
        if (this._where.length > 0) {
          SQL = " AND " + SQL;
        }
      }

      return SQL;
    }
  }, {
    key: 'buildJoin',
    value: function buildJoin() {
      var SQL = "";
      if (this._join.length > 0) {
        for (var i in this._join) {
          if (!this._join.hasOwnProperty(i)) {
            continue;
          }
          var expression = this._join[i];
          SQL += " " + expression.type + " JOIN " + expression.table + " ON " + expression.on;
        }
      }
      return SQL;
    }
  }, {
    key: 'buildLimit',
    value: function buildLimit() {
      if (Array.isArray(this._limit)) {
        return " LIMIT " + this._limit[0] + ", " + this._limit[1];
      }
      return "";
    }
  }, {
    key: 'buildOrderBy',
    value: function buildOrderBy() {
      if (this._orderBy.length > 0) {
        var SQL = " ORDER BY ";
        var fields = this._orderBy.map(function (order) {
          return order.fields + ' ' + order.order;
        });
        return SQL + fields.join(',');
      }
      return "";
    }
  }, {
    key: 'buildGroupBy',
    value: function buildGroupBy() {
      if (this._groupBy) {
        return " GROUP BY " + this._groupBy;
      }
      return "";
    }
  }, {
    key: 'collectParams',
    value: function collectParams() {
      var from = this._table;
      if (!from) {
        throw Error("You need to specify table");
      }

      var fields = this._fields;
      if (fields === null) {
        fields = this.getTableFields(from);
      }
      if (typeof fields !== 'string') {
        fields = fields.join(',');
      }
      return {
        from: from,
        fields: fields,
        where: this._where,
        join: this._join
      };
    }
  }, {
    key: 'getTableFields',
    value: function getTableFields(table) {
      var tableArr = table.split('as');
      var prefix = tableArr[1] ? tableArr[1] : tableArr[0];
      this._fields = [prefix + '.*'];
      return this._fields;
    }
  }, {
    key: 'setQuery',
    value: function setQuery(SQL) {
      if (typeof SQL !== 'string') {
        throw new Error("setQuery: SQL is not a string");
      }
      var id = this.getQueries().length + 1;
      this.queries.push({
        id: id,
        query: SQL,
        executed: false,
        queryTime: 0
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._where = [];
      this._table = null;
      this._join = [];
      this._fields = null;
      this._values = null;
      this._orderBy = [];
      this._groupBy = null;
      this._queryType = null;
      this._limit = [0, DEFAULT_LIMIT];
      this._like = [];
      this._having = [];
    }
  }]);

  return MySQLQueryBuilder;
}();

module.exports = MySQLQueryBuilder;
