var assert = require('chai').assert;
var mqb = require('../../index.js');
var mocks = require('./mocks.js');
//var sql = mqb.select('id, name').from('my_table').where('id', 5).build();
//console.log(sql);

describe('MySQL Query builder main queries:', function() {
  describe('SELECT', function() {
    var sql = mqb.select('id, name').from('my_table').where('id', 5).build();

    it('SQL should be: ' + mocks.SELECT[1], function() {
      assert.equal(mocks.SELECT[1], sql);
    });
  });
});
