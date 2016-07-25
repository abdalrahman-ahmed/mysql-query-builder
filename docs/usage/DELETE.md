# DELETE

```javascript
var SQL = qb.delete('my_table', { id: 1}).build();

// or
var SQL = qb.delete('my_table').where({id: 1}).build();
```
