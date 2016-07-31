'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Insert = function () {
  function Insert() {
    _classCallCheck(this, Insert);
  }

  _createClass(Insert, null, [{
    key: 'setValues',
    value: function setValues(currentValues, values) {
      if (Array.isArray(values)) {
        return this.setValuesArray(currentValues, values);
      }
      currentValues.push(values);
      return currentValues;
    }
  }, {
    key: 'setValuesArray',
    value: function setValuesArray(currentValues, values) {
      for (var i in values) {
        currentValues.push(values[i]);
      }
      return currentValues;
    }
  }, {
    key: 'build',
    value: function build(table, fields, values) {
      var _keys = fields.map(function (key) {
        return '`' + key + '`';
      }).join(',');
      var _values = this.buildValues(fields, values);
      var SQL = 'INSERT INTO ' + table + ' (' + _keys + ') VALUES ' + _values;
      return SQL;
    }
  }, {
    key: 'buildValues',
    value: function buildValues(fields, values) {
      var _values = [];
      for (var i in values) {
        var valuesItem = '(' + fields.map(function (key) {
          return '\'' + values[i][key] + '\'';
        }).join(',') + ')';
        _values.push(valuesItem);
      }
      return _values.join(',');
    }
  }]);

  return Insert;
}();

module.exports = Insert;