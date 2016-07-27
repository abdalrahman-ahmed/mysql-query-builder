# MySQL Query builder
[![Build Status](https://travis-ci.org/niklucky/mysql-query-builder.svg?branch=master)](https://travis-ci.org/niklucky/mysql-query-builder)
[![npm version](https://img.shields.io/npm/v/mysql-qb.svg?style=flat-square)](https://www.npmjs.com/package/mysql-qb)

> Designed to make SQL-queries easier to use. With this builder you don't have to write raw-queries.
In this version you can build simple SQL-queries:
SELECT (with joins), CREATE, UPDATE, DELETE.

> This project is my pet project. So you can use it as is.

## Contents
* [Methods API](https://github.com/niklucky/mysql-query-builder/tree/master/docs/METHODS.md)
* [Usage](https://github.com/niklucky/mysql-query-builder/tree/master/docs/USAGE.md)

# Usage example
### More detailed usage:
* [SELECT](https://github.com/niklucky/mysql-query-builder/tree/master/docs/usage/SELECT.md)
* [INSERT](https://github.com/niklucky/mysql-query-builder/tree/master/docs/usage/SELECT.md)
* [UPDATE](https://github.com/niklucky/mysql-query-builder/tree/master/docs/usage/SELECT.md)
* [DELETE](https://github.com/niklucky/mysql-query-builder/tree/master/docs/usage/SELECT.md)

## As builder
```javascript
var conn = require('mysql');
conn.connect();

var qb = require('mysql-query-builder');

var SQL = qb.select('id, name')
            .from('my_table')
            .where('id', 5)
            .build();
conn.query(SQL, function(error, rows){
  // ... Data processing
});
```

## As builder and executor
### Passing db config
You can pass config in nodejs mysql format:
More info on [mysql](https://github.com/niklucky/mysql-query-builder/tree/master/docs/METHODS.md) package page.
Query builder will create new connection and execute query.
```javascript
var config = {
  host: '127.0.0.1',
  user: 'root',
  password: 'mySecurePassword123',
  database: 'MyDB'
};

var QueryBuilder = require('mysql-query-builder');
var mqb = new QueryBuilder(config);

// Query builder unlike the mysql module returns Promise. Not a callback
var result = mqb.select('id, name')
            .from('my_table')
            .where('id', 5)
            .build()
            .exec();

result.then( result => {
  console.log('DB result: ', result);
}).catch(error => {
  console.log('DB error: ', error);
})
```
### Passing db connection
You can pass to constructor mysql module connection object instead of config.
If connection `state == 'disconnected'` builder will try to get config from connection object and reconnect automatically.

```javascript
var config = {
  host: '127.0.0.1',
  user: 'root',
  password: 'mySecurePassword123',
  database: 'MyDB'
};
var mysql = require('mysql');
var connection = mysql.createConnection(config);
connection.connect();

var QueryBuilder = require('mysql-query-builder');
var mqb = new QueryBuilder(connection); // Passing connection.

// Query builder unlike the mysql module returns Promise. Not a callback
var result = mqb.select('id, name')
            .from('my_table')
            .where('id', 5)
            .build()
            .exec();

result.then( result => {
  console.log('DB result: ', result);
}).catch(error => {
  console.log('DB error: ', error);
})
```

## Commands
Order of method calls in pipeline doesn't matter. They all return `this` so you can use them *UNTIL* `build()` method is called. After that query is immutable.

Method `build()` returns a string and pushes last query in queries array, so you can always get it by `lastQuery()` call.

All methods are described in the [Methods API](https://github.com/niklucky/mysql-query-builder/tree/master/docs/METHODS.md) docs.

## Installation
```bash
npm install --save mysql-qb
```

## Tests
To run tests — where they are belong (tests/unit folder).
