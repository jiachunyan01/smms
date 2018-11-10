var express = require('express');
var router = express.Router();

/* 引入mysql */
var mysql = require("mysql")
//console.log(mysql)

/* 连接数据库 */
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'smms'
});
//console.log(connection)
/* 打开数据库 */
connection.connect();

/* 添加路由 */
router.post('/add', function (req, res, next) {
  /* 执行sql语句 */
  let { pass, username, usergroup } = req.body;
  //console.log(pass,username,usergroup)
  /* 创建sql语句 */
  let sqlStr = `insert into userTable(userName,userPwd,userGroup) values('${username}','${pass}','${usergroup}')`;
  /* 执行sql语句 */
  connection.query(sqlStr, function (error, results) {
    if (error) throw error;
    res.send(results);
  });



});

module.exports = router;
