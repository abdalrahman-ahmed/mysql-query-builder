# SELECT
Select is a most difficult among other query types.
To build SELECT query you have to specify:

FROM by calling ```.from('my_table')``` or ```.from('my_table as mt')``` using as syntax. Builder will figure out and place alias to every field in fields.
Next you specify fields by ```select(FIELDS)```. Fields could be an array ```['id', 'name']``` or string ```'id, name'```.
Also you can use some joins: ```join()``` ('left', 'right', 'inner') or simply without modifier.

** Examples **
```javascript
var SQL = qb.select('id, name, st.email')
            .from('my_table as mt')
            .join('second_table as st', 'st.id=mt.id')
            .join('third_table as tt', 'tt.id=st.id', 'left')
            .where('id', 32)
            .orderBy('tt.id', 'desc')
            .groupBy('tt.name')
            .limit(0, 10)
            .build();

// ... Query execution and data processing
```
