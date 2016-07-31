# UPDATE

```javascript
var SQL = qb.update('my_table', { id: 1, name: 'Steve'}).build();
```
or:

```javascript
qb.setTable('my_table');
// some code ..

qb.update({ id: 1, name: 'Steve'}).build();
```
or with execution. FYI `exec()` will prepare query for building (will call `build()`) before execution:
```javascript
qb.setTable('my_table');
// some code ..

qb.update({ id: 1, name: 'Steve'}).exec();
```
