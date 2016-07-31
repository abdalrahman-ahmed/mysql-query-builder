# INSERT
Insert API is actually quite simple: you pass table (or define table with `setTable()` earlier) and pass data with fields (optional).
If you don't pass fields, builder will get fields out of data object keys.
Cool feature is insert batching: You can create INSERT batch query simply passing an array of objects instead of object.

## Simpe insert
```javascript
var SQL = mqb.insert(
            'my_table',
            ['id', 'name'],
            {id: 1, name: 'Nik'}
          )
          .build();
```

## Even simpler

Without fields:
```javascript
var SQL = mqb.insert(
            'my_table',
            {id: 1, name: 'Nik'})
            .build(); // In that case fields will be taken from object idx
```
## With separate defining table

```javascript
// ... before execution
mqb.setTable('my_table');
// ... some code
// From now on you may call without setting the table
var SQL = mqb.insert({ id: 1, name: 'Steve'}).build();
```

## Insert batch
Example 1:
```javascript
var SQL = db
          .insert('my_table', { id: 1, name: 'Steve'})
          .insert({ id: 2, name: 'Nik'})
          .insert({ id: 3, name: 'Helen'})
          .build();
```
Example 2:
```javascript
var SQL = db
          .setTable('my_table')
          .insert({ id: 1, name: 'Steve'})
          .insert({ id: 2, name: 'Nik'})
          .insert({ id: 3, name: 'Helen'})
          .build();
```
Example 3:
```javascript
var SQL = db
          .setTable('my_table')
          .insert([{ id: 1, name: 'Steve'}, { id: 2, name: 'Nik'}])
          .build();
```
Example 4:
```javascript
var SQL = db
          .setTable('my_table')
          .insert([{ id: 1, name: 'Steve'}, { id: 2, name: 'Nik'}])
          .insert({ id: 3, name: 'Helen'})
          .build();
```
Example 5:
```javascript
mqb.setTable('my_table');

for( var i in myObject){
  mqb.insert(myObject[i]);
}
var SQL = mqb.build();
```
