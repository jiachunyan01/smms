var express = require('express');
var router = express.Router();
var md5 = require("crypto")
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

/* 添加用户路由 */
router.post('/add', function (req, res, next) {
  /* 执行sql语句 */
  let { pass, username, usergroup } = req.body;
  /* 对密码加密 */
  pass = md5.createHash("md5").update(pass).digest("hex");
  //console.log(pass,username,usergroup)
  /* 创建sql语句 */
  let sqlStr = `insert into userTable(userName,userPwd,userGroup) values('${username}','${pass}','${usergroup}')`;
  /* 执行sql语句 */
  connection.query(sqlStr, function (error, results) {
    if (error) throw error;
    //根据sql发挥结果给前端
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号添加成功" });
    } else {
      res.send({ "isOk": false, "msg": "账号添加失败" });

    }

  });



});
/* 显示用户列表路由 */
router.get("/list", function (req, res) {
  //构造sql语句
  let sqlStr = "select * from userTable order by u_id DESC"
  /* 执行sql */
  connection.query(sqlStr, function (err, data) {
    if (err) throw err
    res.send(data)
  })

})
/* 删除的路由 */
router.get("/del", (req, res) => {
  /* 获取id*/
  let id = req.query.id;
  /* 构造sql */
  let sqlStr = "delete from userTable where u_id=?"
  let sqlData = [id]
  /* 执行sql */
  connection.query(sqlStr, sqlData, function (error, data) {
    if (error) throw error;
    if (data.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号删除成功" })
    }
  })

})
/* 获取id的路由 */
router.get("/getOldId", (req, res) => {
  /* 接收id */
  let id = req.query.id
  /* 构造sql语句 */
  let sqlStr = "select * from userTable where u_id=?"
  let sqlData = [id]
  /*执行sql */
  connection.query(sqlStr, sqlData, function (err, data) {
    if (err) throw err;
    res.send(data)
  })
})
/* 保存新数据 */
router.post('/save', function (req, res, next) {
  /* 执行sql语句 */
  let { pass, username, usergroup, u_id } = req.body;
  let newPwd = pass
  /* 对密码加密 */
  pass = md5.createHash("md5").update(newPwd).digest("hex");
  //console.log(pass,username,usergroup)
  /* 创建sql语句 */
  let sqlStr = "update userTable set userName=?,userPwd=?,userGroup=? where u_id=?";
  let sqlData = [username, pass, usergroup, u_id]
  /* 执行sql语句 */
  connection.query(sqlStr, sqlData, function (error, results) {
    if (error) throw error;
    //根据sql发挥结果给前端
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号修改成功" });
    } else {
      res.send({ "isOk": false, "msg": "账号添修改失败" });

    }

  });



});
module.exports = router;
