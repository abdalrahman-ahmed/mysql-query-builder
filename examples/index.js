var config = {
  host: '192.168.99.100',
  user: 'root',
  port: 3306,
  password: '12345',
  database: 'mysql'
};
var mysql      = require('mysql');
var connection = mysql.createConnection(config);
connection.end();
var Mqb = require('./../index.js');
var qb = new Mqb(connection);
var query = qb.select('Host, Db')
            .from('db')
            .where('Host', '')
            .exec();
query.then((result)=>{
  console.log('result', result);
})
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
