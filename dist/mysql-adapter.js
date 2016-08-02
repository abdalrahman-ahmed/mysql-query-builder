'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _connection = null;
var _mysql = null;

var MySQLAdapter = function () {
  function MySQLAdapter() {
    _classCallCheck(this, MySQLAdapter);

    try {
      _mysql = require('mysql');
    } catch (e) {
      throw new Error('Cannot find module \'mysql\'');
    }
  }

  _createClass(MySQLAdapter, [{
    key: 'setConnection',
    value: function setConnection(connection) {
      _connection = connection;
      return this;
    }
  }, {
    key: 'connect',
    value: function connect(config) {
      var connection = _mysql.createConnection(config);
      connection.connect();
      this.setConnection(connection);
      return this.getConnection();
    }
  }, {
    key: 'getConnection',
    value: function getConnection() {
      return _connection;
    }
  }, {
    key: 'exec',
    value: function exec(SQL) {
      return new Promise(function (resolve, reject) {
        return _connection.query(SQL, function (err, rows, fields) {
          if (err) return reject(err);
          return resolve(rows);
        });
      });
    }
  }]);

  return MySQLAdapter;
}();

module.exports = MySQLAdapter;