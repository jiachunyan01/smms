
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
/* 暴露出去 */
module.exports = connection;