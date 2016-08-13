# SELECT ... UNION ... SELECT
[MySQL docs](http://dev.mysql.com/doc/refman/5.7/en/union.html)
`union()` call you should place between regular `select()` calls:

```javascript
var SQL = qb.select('id, name')
            .from('users')
            .where('id', 32)
            .union()  // Setting UNION
            .select('email, password')
            .from('auth')
            .where('userId', 32)
            .build();

// ... Query execution and data processing
```
