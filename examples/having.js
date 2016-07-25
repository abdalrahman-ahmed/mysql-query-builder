var Mqb = require('./../index.js');
var qb = new Mqb();

var SQL = qb.select('Host, Db')
            .from('db')
            .where('Host', '')
            .having('name', 'Nik')
            .build();
console.log("SQL", SQL);
