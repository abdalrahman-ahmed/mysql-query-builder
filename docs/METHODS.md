# Methods
Also see [Examples](https://github.com/niklucky/mysql-query-builder/docs/EXAMPLES.md)

| Query | Methods | Arguments | Description  |
| ----- | ------- | -------- | -----------  |
| Constructor | | `dbConnection`: MySQL connection object | You can execute queries directly from builder if you pass connection object. |
| Queries | | | |
| | `getLastQuery`  | | Returns last builded SQL in an object format: `{ query: "SELECT ...", id: 1, executed: false, queryTime: 0}`. |
| | `exec`  | `SQL`: string (optional)  | Executes query in MySQL if dbConnection or dbConfig object is passed in constructor. If `SQL` is undefined, then `getLastQuery` will be used. SQL passed to method will be added to queries array and after execution will be marked as `executed`  |
| | `getQueries`  | | Returns an array of queries: `[{ query: "SELECT ...", id: 1, executed: false, queryTime: 0}]`|
| | `setTable`  | `table`: string   | You can set table before all queries, so that you can omit table declaration in every query. |
| SELECT  | `select`  | `fields`: string / array / null | `'id, name'` or `['id', 'name']` or empty. In this case fields for query will be like this `table.*` |
| | `from` | `table`: string  | Table name in format `table1` or `table1 as t1`. In that case if `select` arguments were empty fields will be like this: `t1.*`
| | `where` | `key`: string / object, `value`: string / undefined | Examples: `where('id', 1)`, `where({id: 1})`, `where({id: 1, name: 'Nik'})`. You can combine couple calls: `where('id', 1).where({email: 'me@example.com', name: 'Nik'})`. Output will be: `WHERE id=1 AND name = 'Nik' AND email = 'me@example.com'`. **Important**: there is a very useful hint: every `value` could be an Array. In that case `.where('id', [1,2])` will output: `WHERE id IN (1,2)` |
| | `where` (WHERE .. IN ) | `key`: string / object, `value`: array | Another case of using where: there is a very useful hint: every `value` could be an Array. In that case `.where('id', [1,2])` will output: `WHERE id IN (1,2)` |
| | `where` (WHERE .. != ) | `key`: string, `value`: string | Example: `.where('id !=', 1)` will output: `WHERE id !=1` |
| | `whereOR` | `key`: string, `value`: string  | More strict syntax to prevent code complexity. Examples: `where(id, 1).whereOR('id', 2)`. Outputs: `WHERE id=1 OR id=2`|
| | `join` | `table`: string, `on`: string, `type`: string / undefined | `join('table2', 'table2.id=table.id')`. There are 3 modifiers: 'right', 'left', 'inner'. Example: `join('table2', 'table2.id=table.id', 'left')`  |
| | `like`  | `field`: string, `query`: string, `type`: string (both, after, before), `or`: boolean | Example: `like('name', 'Nik')` -> `name LIKE '%Nik%'`. `type` is a selector which points where % sign will be used: on **both** side `%query%`, **before** `%query` or **after** `query%`. If you send `or` argument, then query will be: `OR name LIKE '%query%'` |
| | `likeOR`  | `field`: string, `query`: string, `type`: string (both, after, before) | Same usage as `like`. Only `or=true` argument is passed |
| | `limit` | `start`: number, `limit`: number | Example: `limit(0, 10)`. By default `limit(0, 1000)`
| | `orderBy` | `fields`: string / array, `order`: string (asc) | Example: `orderBy('name')`, outputs: `ORDER BY name ASC` (ASC by default). Or `orderBy('name', 'desc')`. You can define couple orders: `orderBy('name', 'desc').orderBy('dateOfBirth', 'asc')` |
| | `groupBy` | `fields`: string | Example: `groupBy('name')` or `groupBy('name, lastName')`|
| INSERT  | `insert`  | `table`: string, `fileds`: array / object, `data`: object | You can omit fields and in that case **keys** of data object will be used. Examples: `insert('table1', ['id', 'name'], {id: 1, name: 'Nik'})` or `insert('table1', {id: 1, name: 'Nik'})`. Result will be the same.|
| | `insertBatch` | `table`: string, `fields`: array / object, `data`: array  | Inserting array of data in one query. Soon! |
| UPDATE  | `update`  | `table`: string (optional), `values`: object  | **Important** always use with `where` in other case consequences will be not that awesome. Examples: `update('table1', {name: 'Nik'}).where({ name: 'Mark'})` or omit table if you used `setTable('table1')` before: `update({name: 'Nik'}).where({ name: 'Mark'})` |
| | `where` | same as in SELECT section | |
| | `limit` | same as in SELECT section | |
| DELETE  | `delete`  | `table`: string (_optional_), `where`: object (_optional_)  | Example: `delete({ id: 2})`. Or you can simply call with where: `delete().where({ id: 2})` |
| | `where` | same as in SELECT section | |
| | `limit` | same as in SELECT section | |
