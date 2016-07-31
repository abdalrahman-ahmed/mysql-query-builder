var Mqb = require('./../src/index.js');
var qb = new Mqb();

var SQL = qb.insert('my_table', {id: 1, name: 'Nik'})
            .insert({id: 2, name: 'Mark'})
            .build();
console.log("SQL", SQL);
var SQL = qb.insert('my_table', [{id: 1, name: 'Nik'}, {id: 2, name: 'Mark'}])
            .build();
console.log("SQL", SQL);

var SQL = qb.insert('my_table', [{id: 1, name: 'Nik'}, {id: 2, name: 'Mark'}])
            .insert({id: 3, name: 'Helen'})
            .build();
console.log("SQL", SQL);
