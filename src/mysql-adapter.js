'use strict';
let _connection = null;
let _mysql = null;
class MySQLAdapter {

  constructor(){
    try {
      _mysql = require('mysql');
    }catch(e){
      throw new Error('Cannot find module \'mysql\'')
    }
  }

  setConnection(connection){
    _connection = connection;
    return this;
  }

  connect(config){
    let connection = _mysql.createConnection(config);
    connection.connect();
    this.setConnection(connection);
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
