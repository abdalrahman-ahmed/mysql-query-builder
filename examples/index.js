var config = {
  host: '127.0.0.1',
  user: 'root',
  port: 3306
};
var mysql      = require('mysql');
var connection = mysql.createConnection(config);

var mqb = require('./../index.js');
var qb = new mqb(connection);

var SQL = qb.select('id, name')
            .from('my_table')
            .where('id', 5)
            .build();

//connection.connect();
console.log("Connection:", connection.state );
console.log("Connection:", typeof connection.connect === 'function' );
connection.query(SQL, function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows);
});

connection.end();
