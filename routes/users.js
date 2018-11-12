var express = require('express');
var router = express.Router();
var md5 = require("crypto")

/* 引入数据库连接 */
var connection=require("./mysql")

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
      res.send({ "isOk": true, "msg": "您的账号已添加成功~~~" });
    } else {
      res.send({ "isOk": false, "msg": "很遗憾，您的账号添加失败" });

    }

  });



});
/* 显示用户列表路由 */
router.get("/list", function (req, res) {
  //构造sql语句
  let sqlStr = "select * from userTable order by u_id ASC"
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
      res.send({ "isOk": true, "msg": "您的账号已删除成功~~~" })
    } else {
      res.send({ "isOk": false, "msg": "很遗憾，您的账号删除失败" });


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
  let { pass, username, usergroup, u_id, oldPwd } = req.body;
  let newPwd = pass
  /* 对密码加密 */
  if (oldPwd != newPwd) {
    pass = md5.createHash("md5").update(newPwd).digest("hex")
  }
  //console.log(pass,username,usergroup)
  /* 创建sql语句 */
  let sqlStr = "update userTable set userName=?,userPwd=?,userGroup=? where u_id=?";
  let sqlData = [username, pass, usergroup, u_id]
  /* 执行sql语句 */
  connection.query(sqlStr, sqlData, function (error, results) {
    if (error) throw error;
    //根据sql发挥结果给前端
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "您的账号已修改成功~~~" });
    } else {
      res.send({ "isOk": false, "msg": "很遗憾，您的账号修改失败" });

    }

  });



});
/* 验证用户合法性 */
router.post("/checkLogin", (req, res) => {
  let { username, checkPass } = req.body
  /* 执行sql语句 */
  let sqlStr = "select u_id from userTable where userName=? and userPwd=?"
  checkPass = md5.createHash("md5").update(checkPass).digest("hex");
  let sqrData = [username, checkPass]
  connection.query(sqlStr, sqrData, function (err, data) {
    if (err) throw err
    //console.log(data)
    //res.send("1111")
    /* 登录成功写入cookie */
    if (data.length > 0) {


      res.cookie("username", username)
      res.cookie("u_id", data[0].u_id)
      res.send({ "isOk": true, "msg": "您已登录成功~~~" })
    } else {
      res.send({ "isOk": false, "msg": "很遗憾登录失败!!!" })
    }
  })
})
/* 退出销毁cookie */
router.get("/loginOut", (req, res) => {
  res.clearCookie("username")
  res.clearCookie("u_id")
  /* 跳转到登录页面 */
  res.redirect("/login.html")
})
/* 验证用户是否翻墙 */
router.get("/cookieOut",(req,res)=>{
  /* 读取用户cookie */
  var username=req.cookies.username
  if(!username){
    res.send("alert('请先登录再进入页面~~~');location.href='login.html'")
  }else{
    res.send("")
  }
})
module.exports = router;
