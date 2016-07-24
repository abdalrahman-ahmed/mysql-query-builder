'use strict';
const _mysql = require('mysql');
let _connection = null;

class MySQLAdapter {

  setConnection(connection){
    _connection = connection;
    return this;
  }

  connect(config){
    this.setConnection(_mysql.createConnection(config));
    return this.getConnection();
  }

  getConnection(){
    return _connection;
  }

  exec(SQL){
    return new Promise((resolve, reject) => {
      return _connection.query(SQL, function(err, rows, fields) {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }
}

module.exports = MySQLAdapter;
