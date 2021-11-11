const mysql = require('mysql')
const config = require('../../config/dbConfig')
const logger = require('../../config/logger')

/**
 * 生成日志新息
 * @param {*} type 
 * @param  {...any} param 
 */
const generateMessage = (type, ...param) => {
  logger[type](...param)
}

/**
 * 数据库连接池
 * @type {Pool}
 */
const pool  = mysql.createPool({
  connectionLimit : config.database.connectionLimit,
  host            : config.database.HOST,
  user            : config.database.USERNAME,
  password        : config.database.PASSWORD,
  database        : config.database.DATABASE,
  port            : config.database.PORT
});

/**
 * 通用方法
 * @param msg
 * @param sql
 */
module.exports =  (msg, sql) => {
  return new Promise( (resolve, reject) => {
    // 1 连接数据库
    pool.getConnection(function(err, connection) {
      // console.log( msg + 'sql：============>', sql)
      generateMessage('info', msg + 'sql：============>', sql)
      if (err) {
        // console.log(`err`, err)
        generateMessage('error', err.message)
        reject(err)
      }
      // 2 查询数据库语句
      connection.query(sql, function (error, data, fields) {
        // 3 释放连接
        connection.release();
        // 4 判断是否异常
        if (error) {
            generateMessage('error', error.message)
            reject(error)
        }
        // 5 获取数据成功
        resolve(data)
      });
    });
  })
}