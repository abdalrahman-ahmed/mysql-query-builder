var Mqb = require('./../index.js');
var qb = new Mqb();

var SQL = qb.select(['firstName', 'lastName'])
            .from('users')
            .where('id', 1)
            .union()
            .select(['username', 'password'])
            .from('auth')
            .where('userId', 1)
            .build();
console.log("SQL", SQL);
