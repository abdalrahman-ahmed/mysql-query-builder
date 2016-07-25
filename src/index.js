"use strict";
const path = require('path');

const DEFAULT_LIMIT = 1000;
const DEFAULT_ORDER = 'ASC';
const BOOLEAN_AND = 'AND';

const TYPE_SELECT = 'select';
const TYPE_INSERT = 'insert';
const TYPE_UPDATE = 'update';
const TYPE_DELETE = 'delete';

let dbAdapter = require(path.join(__dirname, '/src/db-adapter'));

/** Class representing a MySQLQueryBuilder. */
class MySQLQueryBuilder {
  /**
   * Initializing config and connections. It is optional
   * Resets all fields
   * @param {object} db - MySQL connection object or simple config object in format of node mysql
   */
  constructor(db) {
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
  setDb(db){
    if(typeof db === 'object'){
      if(db.connect !== undefined && typeof db.connect === 'function'){
        this.dbConnection = db;
        return true;
      }
      if(db.host !== undefined){
        this.dbConfig = db;
        return true;
      }
    }
    return false;
  }
  getQuery(query){
    if(query === undefined){
      query = this.getLastQuery();
    }
    if(query === null){
      throw new Error("Exec: No query to execute");
    }
    if(typeof query === 'string'){
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
  exec(query){
    if(this.dbConnection === undefined && this.dbConfig === undefined){
      throw new Error("Exec: Nor database config neither connection is specified. Execution is aborted");
    }
    query = this.getQuery(query);
    let db = new dbAdapter('mysql');

    if(this.dbConnection === undefined){
      this.dbConnection = db.setConfig(this.dbConfig).connect();
    }
    db.setConnection(this.dbConnection);

    return new Promise((resolve, reject) => {
      return db.exec(query.query).then(result => {
        query.executed = true;
        resolve(result);
      }).catch(err => {
        reject(err)
      });
    })
  }

  getLastQuery() {
    const queries = this.getQueries();
    if(queries.length > 0 ){
      return queries[queries.length-1];
    }
    return null;
  }

  getQueries() {
    return this.queries;
  }

  setTable(table){
    this._table = table;
    return this;
  }

  select(fields = null) {
    this._queryType = TYPE_SELECT;
    this._fields = fields;
    return this;
  }

  insert(){
    this._queryType = TYPE_INSERT;
    let table, fields, data = undefined;

    if( arguments.length === 0){
      throw new Error("Insert: data is not provided");
    }

    if( arguments.length === 1){
      if(this._table === null){
        throw new Error("Insert: table is not provided");
      }
      this._values = arguments[0];
    }

    if( arguments.length === 2){
      this._table = arguments[0];
      this._values = arguments[1];
    }
    if( arguments.length === 3){
      this._table = arguments[0];
      this._fields = arguments[1];
      this._values = arguments[2];
    }

    if(typeof this._table !== 'string'){
      throw new Error("Table is undefined");
    }

    if(typeof this._values !== 'object'){
      throw new Error("Insert data is empty");
    }

    if(this._fields === null){
      this._fields = Object.keys(this._values)
    }

    return this;
  }

  update(){
    if(arguments.length === 0){
      if(typeof this._table !== 'string'){
        throw new Error("Update: Table is undefined");
      }
      throw new Error("Update: Data is undefined");
    }
    if(arguments.length === 2){
      this.setTable(arguments[0]);
      if( typeof this._table !== 'string'){
        throw new Error("Update: Table is undefined");
      }
      if( typeof arguments[1] !== 'object'){
        throw new Error("Update: Data is not object");
      }

      this._queryType = TYPE_UPDATE;
      this._values = arguments[1];
      return this;
    }

    if( typeof this._table !== 'string'){
      throw new Error("Update: Table is undefined");
    }

    if(typeof arguments[0] !== 'object'){
      throw new Error("Update: Data is undefined");
    }

    this._queryType = TYPE_UPDATE;
    this._values = arguments[0];
    return this;
  }

  delete(){
    this._queryType = TYPE_DELETE;

    if(arguments.length === 2){
      this.setTable(arguments[0]);
      if( typeof arguments[1] === 'object'){
        for( var i in arguments[1]){
          this._where.push({
            key: i,
            value: arguments[1][i],
            or: false
          });
        }
      }
      return this;
    }
    if(arguments.length === 1){
      if(typeof arguments[0] !== 'string'){
        throw new Error("Delete: Table is undefined");
      }
      this.setTable(arguments[0]);
    }
    return this;
  }

  from(from) {
    if(typeof from !== 'string'){
      throw new Error("From: Table is undefined");
    }
    this.setTable(from);
    return this;
  }

  where(key, value) {
    if( key === undefined && value === undefined){
      throw new Error("Where: nor key neither value is specified");
    }
    if (typeof key === 'object') {
      return this.whereObject(key);
    }
    this._where.push({
      key: key,
      value: value,
      or: false
    });
    return this;
  }

  whereObject(object) {
    if(typeof object !== 'object'){
      throw new Error("Where: expected object got undefined");
    }
    for (var key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      let value = object[key];
      this._where.push({
        key: key,
        value: value,
        or: false
      });
    }
    return this;
  }

  whereOR(key, value) {
    if( key === undefined && value === undefined){
      throw new Error("Where OR: nor key neither value is specified");
    }
    if(value === undefined){
      throw new Error("Where OR: value is undefined");
    }
    this._where.push({
      key:key,
      value: value,
      or: true
    });
    return this;
  }

  like(field, query, type = 'both', or = false) {

    this._like.push({
      field: field,
      query: query,
      type: type,
      or: or
    });
    return this;
  }

  likeOR(field, query, type) {
    this.like(field, query, type, true);
    return this;
  }

  join(table, on, type = '') {
    if(typeof table !== 'string' || typeof on !== 'string'){
      throw new Error("JOIN: you need to specify TABLE and ON for join");
    }
    this._join.push({
      table: table,
      on: on,
      type: type.toUpperCase(type)
    });
    return this;
  }

  limit(start = 0, limit = DEFAULT_LIMIT ) {
    this._limit = [start, limit];
    return this;
  }

  orderBy(orderFields, order = DEFAULT_ORDER) {
    if(Array.isArray(orderFields)){
      orderFields = orderFields.join(',');
    }
    if( typeof orderFields !== 'string'){
      throw new Error("ORDER BY: fields must be string or array");
    }
    this._orderBy.push({
      fields: orderFields,
      order: order
    });
    return this;
  }

  groupBy(fields) {
    if(typeof fields !== 'string'){
      throw new Error("GROUP BY: fields must be string");
    }
    this._groupBy = fields;
    return this;
  }

  having(){
    let args = arguments;
    let having = {};
    let booleanOperator = BOOLEAN_AND;

    if(args.length === 0){
      throw new Error("HAVING: no arguments passed");
    }

    if(args.length === 1){
      if( typeof args[0] !== 'object'){
        throw new Error("HAVING: no value for having passed")
      }
      having = args[0];
    }

    if(args.length === 2){
      if(typeof args[0] === 'string'){
        having[args[0]] = args[1];
      }
      if(typeof args[0] === 'object'){
        having = args[0];
        booleanOperator = args[1].toUpperCase();
      }
    }

    if(args.length === 3){
      having[args[0]] = args[1];
      booleanOperator = args[2].toUpperCase();
    }

    for( let field in having){
      this._having.push({
        field: field,
        value: having[field],
        booleanOperator: booleanOperator,
      });
    }

    return this;
  }

  build() {
    if(this._queryType === TYPE_SELECT){
      return this.buildSelectSQL();
    }

    if(this._queryType === TYPE_INSERT){
      return this.buildInsertSQL();
    }

    if(this._queryType === TYPE_UPDATE){
      return this.buildUpdateSQL();
    }

    if(this._queryType === TYPE_DELETE){
      return this.buildDeleteSQL();
    }

    throw new Error("Query type " + this._queryType + " is not supported");
  }

  afterBuild(SQL){
    if(typeof SQL !== 'string'){
      throw new Error("After build: SQL is not string. " + SQL);
    }
    SQL += ';';

    this.setQuery(SQL);
    this.reset();
    return SQL;
  }

  buildInsertSQL(){
    const keys = this._fields.map( key => ( '`' + key + '`' ) ).join(',');
    const values = this._fields.map( key => ( '\'' + this._values[key] + '\'' ) ).join(',');
    let SQL = 'INSERT INTO ' + this._table + ' (' + keys + ') VALUES (' + values + ')';
    return this.afterBuild(SQL);
  }

  buildUpdateSQL(){
    const where = this.buildWhere();
    let SQL = "UPDATE " + this._table + " SET ";
    let _set = [];
    for( let key in this._values){
      if (!this._values.hasOwnProperty(key)) {
        continue;
      }
      _set.push('`' + key + '`=\'' + this._values[key] + '\'');
    }
    SQL += _set.join(',');
    SQL += " WHERE " + where;
    return this.afterBuild(SQL);
  }

  buildDeleteSQL(){
    let SQL = "DELETE FROM " + this._table + " WHERE " + this.buildWhere();
    return this.afterBuild(SQL);
  }

  buildSelectSQL() {
    let params = this.collectParams();
    let where = "";

    if (this._where.length > 0 || this._like.length > 0) {
      where = this.buildWhere() + this.buildLike();
      if( where){
        where = " WHERE " + where;
      }
    }

    let SQL =
      "SELECT " + params.fields + " " +
        "FROM " + params.from +
        this.buildJoin() +
        where +
        this.buildOrderBy() +
        this.buildGroupBy() +
        this.buildLimit();

    return this.afterBuild(SQL);
  }

  buildWhere() {
    let SQL = "";
    if (this._where.length > 0) {
      for (var i in this._where) {
        if (!this._where.hasOwnProperty(i)) {
          continue;
        }

        let expression = this._where[i];
        let expressionValue = '';

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

        if (typeof expression.value === 'object') {
          sign = " IN ";
          for (var key in expression.value) {
            if (!this._where.hasOwnProperty(i)) {
              continue;
            }
            let value = expression.value[key];
            expressionValue = value;
            if (typeof value === "number") {

            } else {
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

  buildLike() {
    let SQL = "";
    if (this._like.length > 0) {
      for (var i in this._like) {
        if (!this._like.hasOwnProperty(i)) {
          continue;
        }
        let expression = this._like[i];
        if (SQL !== "") {
          if (expression.or) {
            SQL += " OR ";
          } else {
            SQL += " AND ";
          }
        }
        let value = "";
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

  buildJoin() {
    let SQL = "";
    if (this._join.length > 0) {
      for (var i in this._join) {
        if (!this._join.hasOwnProperty(i)) {
          continue;
        }
        let expression = this._join[i];
        SQL += " " + expression.type +
          " JOIN " + expression.table +
          " ON " + expression.on;
      }
    }
    return SQL;
  }

  buildLimit() {
    if (Array.isArray(this._limit)) {
      return " LIMIT " + this._limit[0] + ", " + this._limit[1];
    }
    return "";
  }

  buildOrderBy() {
    if (this._orderBy.length > 0) {
      let SQL = " ORDER BY "
      let fields = this._orderBy.map( order => { return order.fields + ' ' + order.order } );
      return SQL + fields.join(',');
    }
    return "";
  }

  buildGroupBy() {
    if (this._groupBy) {
      return " GROUP BY " + this._groupBy;
    }
    return "";
  }

  collectParams() {
    let from = this._table;
    if (!from) {
      throw Error("You need to specify table");
    }

    let fields = this._fields;
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

  getTableFields(table) {
    let tableArr = table.split('as');
    let prefix = (tableArr[1]) ? tableArr[1] : tableArr[0];
    this._fields = [prefix + '.*'];
    return this._fields;
  }

  setQuery(SQL) {
    if(typeof SQL !== 'string'){
      throw new Error("setQuery: SQL is not a string")
    }
    const id = this.getQueries().length + 1;
    this.queries.push({
      id: id,
      query: SQL,
      executed: false,
      queryTime: 0
    });
  }

  reset() {
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
}

module.exports = MySQLQueryBuilder;
