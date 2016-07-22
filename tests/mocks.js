module.exports = {
  SELECT: {
    1: "SELECT id, name FROM table  WHERE `id`=5 LIMIT 0, 1000;",
    2: "SELECT t1.id, t1.name, t2.email FROM table1 as t1  JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1.id`=5 LIMIT 0, 1000;",
    3: "SELECT t1.id, t1.name, t2.email FROM table1 as t1 LEFT JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1.id`=5 LIMIT 0, 1000;",
    4: "SELECT t1.id, t1.name, t2.email FROM table1 as t1 RIGHT JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1.id`=5 LIMIT 0, 1000;",
    5: "SELECT t1.id, t1.name, t2.email FROM table1 as t1 INNER JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1.id`=5 LIMIT 0, 1000;",
    6: "SELECT t1.id, t1.name, t2.email, t3.school FROM table1 as t1 INNER JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1.id`=5 LIMIT 0, 1000;",
    7: "SELECT t1.id, t1.name, t2.email, t3.school, t4.nikname FROM table1 as t1 INNER JOIN table2 as t2 ON t2.userId=t1.id WHERE `t1.id`=5 LIMIT 0, 1000;",
    8: "SELECT id, name FROM table1  WHERE `id`=5 AND `name`='Nik' LIMIT 0, 1000;",
    9: "SELECT id, name FROM table1  WHERE `id`=5 AND `name`='Nik' OR `title`='Lucky' LIMIT 0, 1000;",
    10: "SELECT id, name FROM table1  WHERE `name`!='Lucky' LIMIT 0, 1000;",
    11: "SELECT id, name FROM table1  LIMIT 0, 100;",
    12: "SELECT id, name FROM table1  LIMIT 0, 1000;",
    13: "SELECT id, name FROM table1  ORDER BY name asc LIMIT 0, 100;"
  }
}
