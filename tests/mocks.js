module.exports = {
  SELECT: {
    1: "SELECT id, name FROM table WHERE `id`=5;",
    2: "SELECT t1.id, t1.name, t2.email FROM table1 as t1  JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1`.`id`=5;",
    3: "SELECT t1.id, t1.name, t2.email FROM table1 as t1 LEFT JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1`.`id`=5;",
    4: "SELECT t1.id, t1.name, t2.email FROM table1 as t1 RIGHT JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1`.`id`=5;",
    5: "SELECT t1.id, t1.name, t2.email FROM table1 as t1 INNER JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1`.`id`=5;",
    6: "SELECT t1.id, t1.name, t2.email, t3.school FROM table1 as t1 INNER JOIN table2 as t2 ON t2.userId=t1.id LEFT JOIN table3 as t3 ON t3.userId=t1.id WHERE `t1`.`id`=5;",
    7: "SELECT t1.id, t1.name, t2.email, t3.school, t4.nikname FROM table1 as t1 INNER JOIN table2 as t2 ON t2.userId=t1.id LEFT JOIN table3 as t3 ON t3.userId=t1.id RIGHT JOIN table4 as t4 ON t4.userId=t1.id WHERE `t1`.`id`=5;",
    8: "SELECT id, name FROM table1 WHERE `id`=5 AND `name`='Nik';",
    9: "SELECT id, name FROM table1 WHERE `id`=5 AND `name`='Nik' OR `title`='Lucky';",
    10: "SELECT id, name FROM table1 WHERE `name`!='Lucky';",
    11: "SELECT id, name FROM table1 LIMIT 0, 100;",
    12: "SELECT id, name FROM table1;",
    13: "SELECT id, name FROM table1 ORDER BY name asc LIMIT 0, 100;",
    14: "SELECT firstName, lastName FROM table2;",
    15: "SELECT id, name FROM table1 GROUP BY name HAVING  `name` = 'Nik' ORDER BY name asc LIMIT 0, 100;"
  },
  INSERT: {
    1: "INSERT INTO table1 (`id`,`name`) VALUES ('1','Nik');"
  },
  UPDATE: {
    1: "UPDATE table1 SET `id`='1',`name`='Nik' WHERE ;",
    2: "UPDATE table1 SET `id`='1',`name`='Nik' WHERE `id`=1;"
  },
  DELETE: {
    1: "DELETE FROM table1 WHERE `id`=1;"
  },
  DB: {
    connection: {
      state: false,
      connect: function(){},
      config: {

      }
    },
    config: {
      host: '127.0.0.1',
      user: 'root',
      port: 3306
    }
  },
  mysql: {

  }
}
