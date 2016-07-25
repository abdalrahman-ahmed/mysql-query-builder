# INSERT
```javascript
var SQL = db.insert(
            'my_table',
            ['id', 'name'],
            {id: 1, name: 'Nik'});

// Or you can use simplier variant
var SQL = db.insert(
            'my_table',
            {id: 1, name: 'Nik'})
            .build(); // In that case fields will be taken from object idx
// Or even simplier
// ... before execution
qb.setTable('my_table');

// From now on you may call without setting the table
var SQL = db.insert({ id: 1, name: 'Steve'}).build();

```
