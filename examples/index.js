var config = {
  host: '192.168.99.100',
  user: 'root',
  port: 3306,
  password: 'qwe123',
  database: 'mysql'
};
var mysql      = require('mysql');
var connection = mysql.createConnection(config);
connection.end();
var Mqb = require('./../index.js');
var qb = new Mqb(connection);

var SQL = qb.select('Host, Db')
            .from('db')
            .where('Host', '')
            .build();
console.log("SQL", SQL);
// console.log("Exec: " );
// qb.exec().then( result => {
//   console.log(result);
// }).catch(err => {
//   console.log("Error: ", err)
// })
//
// connection.connect();
// connection.query(SQL, function(err, rows, fields) {
//   if (err) throw err;
//
//   console.log('The result is: ', rows);
// });
//
// connection.end();
