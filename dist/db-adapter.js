'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _connection = null,
    _dbType = null,
    _adapter = null,
    _config = null;

var DBAdapter = function () {
  function DBAdapter(dbType) {
    _classCallCheck(this, DBAdapter);

    _connection = null;
    _adapter = null;
    _config = null;

    this.setDbType(dbType);
  }

  _createClass(DBAdapter, [{
    key: 'setDbType',
    value: function setDbType(dbType) {
      if (typeof dbType !== 'string') {
        dbType = 'mysql';
      }
      if (dbType === 'mysql') {
        _dbType = dbType;
        var DB = require('./mysql-adapter');
        _adapter = new DB();
      }
      return this;
    }
  }, {
    key: 'getDbType',
    value: function getDbType() {
      return _dbType;
    }
  }, {
    key: 'getAdapter',
    value: function getAdapter() {
      return _adapter;
    }
  }, {
    key: 'setConnection',
    value: function setConnection(connection) {
      if ((typeof connection === 'undefined' ? 'undefined' : _typeof(connection)) !== 'object') {
        throw new Error("Connection is not valid object");
      }
      _connection = connection;
      this.getAdapter().setConnection(connection);
      this.setConfig(this.getConnection().config);
      return this;
    }
  }, {
    key: 'getConnection',
    value: function getConnection() {
      return _connection;
    }
  }, {
    key: 'setConfig',
    value: function setConfig(config) {
      _config = config;
      return this;
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      return _config;
    }
    /* istanbul ignore next */

  }, {
    key: 'checkConnectionStatus',
    value: function checkConnectionStatus() {
      if (this.getConnection().state === 'disconnected') {
        console.log("Disconnected. Trying to reconnect");
        this.setConnection(this.getAdapter().connect(this.getConfig()));
      }
    }
    /* istanbul ignore next */

  }, {
    key: 'connect',
    value: function connect() {
      _connection = this.getAdapter().connect(this.getConfig());
      if (!_connection) {
        throw new Error("Connection to database failed");
      }
      return _connection;
    }
    /* istanbul ignore next */

  }, {
    key: 'exec',
    value: function exec(query) {
      this.checkConnectionStatus();
      return this.getAdapter().exec(query);
    }
  }]);

  return DBAdapter;
}();

module.exports = DBAdapter;