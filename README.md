# MySQL Query builder
Designed to make SQL-queries easier to use. With this builder you don't have to write raw-queries.
In this version you can build simple SQL-queries:
SELECT (with joins), CREATE, UPDATE, DELETE.

This project is my pet project. So you can use it as is. 

## Usage example
```
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

## Commands (soon)
Order of commands in pipeline doesn't matter. They all return ```this``` so you can use them *UNTIL* ```build()``` method is called. After that query is immutable.

Method ```build()``` returns a string and pushes last query in queries array, so you can always get it by ```lastQuery()``` call.

### SELECT
Select is a most difficult among other query types.
To build SELECT query you have to specify:

FROM by calling ```.from('my_table')``` or ```.from('my_table as mt')``` using as syntax. Builder will figure out and place alias to every field in fields.
Next you specify fields by ```select(FIELDS)```. Fields could be an array ```['id', 'name']``` or string ```'id, name'```.
Also you can use some joins: ```join()``` ('left', 'right', 'inner') or simply without modifier.

** Examples **
```
var SQL = qb.select('id, name, st.email')
            .from('my_table as mt')
            .join('second_table as st', 'st.id=mt.id')
            .join('third_table as tt', 'tt.id=st.id', 'left')
            .where('id', 32)
            .orderBy('tt.id', 'desc')
            .groupBy('tt.name')
            .limit(0, 10)
            .buildSQL();

// ... Query execution and data processing
```

### INSERT
```
var SQL = db.insert(
            'my_table',
            ['id', 'name'],
            {id: 1, name: 'Steve'});

// Or you can use simplier variant
var SQL = db.insert(
            'my_table',
            {id: 1, name: 'Steve'}); // In that case fields will be taken from object idx
// Or even simplier
// ... before execution
qb.setTable('my_table');

// From now on you may call without setting the table
var SQL = db.insert(
            {
              id: 1,
              name: 'Steve'
            });

```

### UPDATE
```
var SQL = qb.update('my_table', { id: 1, name: 'Steve'});
```

### DELETE
```
var SQL = qb.delete('my_table', { id: 1});

// or
var SQL = qb.delete('my_table').where({id: 1});
```


## Installation
```
npm install --save mysql-query-builder
```

## Tests
To run tests:
```
node node_modules/mysql-query-builder/tests
```
