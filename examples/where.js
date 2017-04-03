var Mqb = require('./../src/index.js');
var qb = new Mqb();

var SQL = qb.select('id').from('my_table').where('id !=', 1).build();
console.log("SQL", SQL);
var SQL = qb.select('id').from('my_table').where('id >', 1).build();
console.log("SQL", SQL);
var SQL = qb.select('id').from('my_table').where('id <', 1).build();
console.log("SQL", SQL);
var SQL = qb.select('id').from('my_table').where('id >=', 1).build();
console.log("SQL", SQL);
var SQL = qb.select('id').from('my_table').where('id <=', 1).build();
console.log("SQL", SQL);
var SQL = qb.select('id').from('my_table').where('id', null).build();
console.log("SQL", SQL);
var SQL = qb.select('id').from('my_table').where('id !=', null).build();
console.log("SQL", SQL);
var SQL = qb.select('id').from('my_table').where({ 'id !=': null }).build();
console.log("SQL", SQL);
var SQL = qb.select('id').from('my_table').where({ id: null }).build();
console.log("SQL", SQL);
var SQL = 
qb.select('id, firstName')
.from('users')
.where({ id: 1 })
.groupBy('firstName')
.orderBy('id')
.build();
console.log("SQL", SQL);
