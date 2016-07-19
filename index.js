var qb = require('./src/index');
var sql = qb.select('id, name').from('my_table').where('id', 5).build();
console.log(sql);
