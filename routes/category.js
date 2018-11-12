var express = require('express');
var router = express.Router();
/* 引入数据库连接 */
var connection = require("./mysql")
/* 添加用户路由 */
router.post('/add', function (req, res, next) {
  /* 执行sql语句 */
  let { state, name, usergroup } = req.body;
  /* 创建sql语句 */
  let sqlStr = `insert into categoryGoods(cg_fatherID,cg_name,cg_isLocked) values('${usergroup}','${name}','${state}')`;
  /* 执行sql语句 */
  connection.query(sqlStr, function (error, results) {
    if (error) throw error;
    //根据sql发挥结果给前端
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "您的分类已添加成功~~~" });
    } else {
      res.send({ "isOk": false, "msg": "很遗憾，您的分类添加失败" });

    }

  });



});
/* 显示用户列表路由 */
router.get("/list", function (req, res) {
  //构造sql语句
  let sqlStr = "select * from categoryGoods order by cg_id ASC"
  /* 执行sql */
  connection.query(sqlStr, function (err, categoryList) {
    if (err) throw err
    res.send(categoryList)
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

module.exports = router;
