'use strict';
let
  _connection = null,
  _dbType = null,
  _adapter = null,
  _config = null;

class DBAdapter {
  constructor(dbType){
    _connection = null;
    _adapter = null;
    _config = null;

    this.setDbType(dbType);
  }

  setDbType(dbType){
    if(typeof dbType !== 'string'){
      dbType = 'mysql';
    }
    if(dbType === 'mysql'){
      _dbType = dbType;
      let DB = require('./mysql-adapter');
      _adapter = new DB();
    }
    return this;
  }

  getDbType(){
    return _dbType;
  }

  getAdapter(){
    return _adapter;
  }

  setConnection(connection){
    if(typeof connection !== 'object'){
      throw new Error("Connection is not valid object");
    }
    _connection = connection;
    this.getAdapter().setConnection(connection);
    this.setConfig(this.getConnection().config);
    return this;
  }

  getConnection(){
    return _connection;
  }

  setConfig(config){
    _config = config;
    return this;
  }

  getConfig(){
    return _config;
  }
  checkConnection(){
    if(this.getConnection().state === 'disconnected'){
      console.log("Disconnected. Trying to reconnect");
      this.setConnection(
        this.getAdapter().connect(
          this.getConfig()
        )
      );
    }
  }
  connect(){
    _connection = this.getAdapter().connect(this.getConfig());
    if(! _connection){
      throw new Error("Connection to database failed");
    }
    return _connection;
  }

  exec(query){
    this.checkConnection();
    return this.getAdapter().exec(query);
  }
}
module.exports = DBAdapter;
