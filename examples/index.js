var qb = require('./../index');
var sql = qb.select('id, name').from('my_table').where('id', 5).build();
console.log(sql);

var sql2 = qb.update('my_table', {name: 'Orange'}).where('id', 5).build();
console.log(sql2);

var sql3 = qb.delete('my_table').where('id', 5).build();
console.log(sql3);
