const express = require('express')
const path = require('path')
const router = require('./routers/router')
const config = require('../config/dbConfig')

// 创建一个服务
const app = express()



// 3.0设置模板引擎
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// 使用对 Post 来的数据 json 格式化
app.use(express.json());

// 使用对 表单提交的数据 进行格式化
app.use(express.urlencoded({ extended: false }));
app.all('/api/*', (req, res, next) => {
  // 设置允许跨域响应报文头
  res.header('Access-Control-Allow-Origin', '*')
  // 设置服务器支持的所有头信息字段
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
  )
  // 设置服务器支持的所有跨域请求的方法
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')

  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  next()
})

// 3.1设置静态资源代理
app.use(express.static(path.join(__dirname, 'public')))

// 3.2 设置路由规则
app.use('/', router)


// 4.0 catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.send(404)
});



app.listen(config.port, function () {
  console.log('node-api服务已启动, :8082');
})