'use strict';
let
  _connection = null,
  _name = 'mysql',
  _adapter = null,
  _config = null;

class DBAdapter {
  constructor(db){
    this.setDb(db);
  }

  setDb(db){
    if(db === 'mysql'){
      _name = db;
      let DB = require('./mysql-adapter');
      _adapter = new DB();
    }
    return this;
  }
  getAdapter(){
    return _adapter;
  }

  setConnection(connection){
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
