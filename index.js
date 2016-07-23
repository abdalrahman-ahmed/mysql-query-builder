"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_LIMIT = 1000;
var DEFAULT_ORDER = 'ASC';

var TYPE_SELECT = 'select';
var TYPE_INSERT = 'insert';
var TYPE_UPDATE = 'update';
var TYPE_DELETE = 'delete';

var MySQLQueryBuilder = function () {
  function MySQLQueryBuilder(dbConnection) {
    _classCallCheck(this, MySQLQueryBuilder);

    this._dbConnection = dbConnection;
    this.reset();
    this.queries = [];
  }

  _createClass(MySQLQueryBuilder, [{
    key: 'exec',
    value: function exec(query) {
      var _this = this;

      if (this.dbConnection != null) {
        return new Promise(function (resolve, reject) {
          if (query === undefined) {
            query = _this.getLastQuery();
          }
          if (query === null) {
            throw new Error("Exec: No query to execute");
          }
          if (typeof query === 'string') {
            _this.setQuery(query);
            query = _this.getLastQuery();
          }
          _this.dbConnection.query(query.query, function (error, rows, fields) {
            query.executed = true;
            if (error) {
              return reject(error);
            }
            console.log('this.getQueries()', _this.getQueries());
            resolve(rows);
          });
        });
      }
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
    value: function insert(table, fields, data) {
      if (table === undefined) {
        throw new Error("Table is undefined");
      }
      this._table = table;
      this._queryType = TYPE_INSERT;
      this._fields = fields;

      if (data === undefined) {
        data = fields;

        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
          throw new Error("Insert data is empty");
        }
        this._fields = Object.keys(fields);
      }
      this._values = data;
      return this;
    }
  }, {
    key: 'update',
    value: function update() {
      if (arguments.length === 0) {
        throw new Error("Update: Data is undefined");
      }
      this._queryType = TYPE_UPDATE;

      if (arguments.length == 2) {
        this.setTable(arguments[0]);
        this._values = arguments[1];
        return this;
      }

      if (_typeof(arguments[0]) !== 'object') {
        throw new Error("Update: Data is undefined");
      }
      this._values = arguments[0];
      return this;
    }
  }, {
    key: 'delete',
    value: function _delete() {
      this._queryType = TYPE_DELETE;

      if (arguments.length === 2) {
        this.setTable(arguments[0]);
        this._where = arguments[1];
        return this;
      }
      if (arguments.length === 1) {
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
      var _this2 = this;

      var keys = this._fields.map(function (key) {
        return '`' + key + '`';
      }).join(',');
      var values = this._fields.map(function (key) {
        return '\'' + _this2._values[key] + '\'';
      }).join(',');
      var SQL = 'INSERT INTO ' + this._table + '(' + keys + ') VALUES (' + values + ')';
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
    }
  }]);

  return MySQLQueryBuilder;
}();

module.exports = MySQLQueryBuilder;
