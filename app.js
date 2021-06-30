// 1、开启服务器
const express = require('express')
const app = express()
// 6、请求路由文件
var topic = require('./routes/topic')
var Session = require('./routes/session')
var comment = require('./routes/comment')

// // 5、用于存储用户的登录状态信息
var session = require('express-session')
// 2、开放公共资源
let path = require('path')
app.use('/public/', express.static(path.join(__dirname,'./public/')))
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')))
// 3、用于获取post请求的数据
var bodyParser = require('body-parser')
// 配置解析表单post请求插件(注意：一定要在app.use(router))之前调用
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// 4、用于渲染模板数据
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views')) //将view目录设置为HTML的默认目录，默认就是views目录

app.use(session({
	/* 配置加密字符串，他会在原有加密的基础之上和这个支付串拼起来去加密
	 目的是为了增加安全性，防止客户端恶意伪造
	 */
	secret: 'community',
	resave: false,
	saveUninitialized: true  //无论你是否使用session，都默认直接给你封/陪一把钥匙
}))

// 6、挂载路由文件
app.use(topic)
app.use(Session)
app.use(comment)




app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})








