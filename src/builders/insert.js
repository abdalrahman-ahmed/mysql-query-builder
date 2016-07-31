class Insert {

  static setValues(currentValues, values){
    if(Array.isArray(values)){
      return this.setValuesArray(currentValues, values);
    }
    currentValues.push(values);
    return currentValues;
  }

  static setValuesArray(currentValues, values){
    for(var i in values){
      currentValues.push(values[i]);
    }
    return currentValues;
  }

  static build(table, fields, values){
    const _keys = fields.map( key => ( '`' + key + '`' ) ).join(',');
    const _values = this.buildValues(fields, values);
    let SQL = 'INSERT INTO ' + table + ' (' + _keys + ') VALUES ' + _values;
    return SQL;
  }

  static buildValues(fields, values){
    var _values = [];
    for( var i in values){
      var valuesItem = '(' + fields.map( key => ( '\'' + values[i][key] + '\'' ) ).join(',') + ')';
      _values.push(valuesItem)
    }
    return _values.join(',');
  }
}

module.exports = Insert;
