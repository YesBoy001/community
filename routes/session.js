var express = require('express')
var md5 = require('blueimp-md5')
var User = require('../models/user')
var router = express.Router()

router.get('/login', (req, res) => {
	res.render('login.html')
})
router.post('/login', (req, res) => {
	User.find({
		email: req.body.email,
		password: md5(md5(req.body.password))
	}, (err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '用户登录失败'
			})
		}
		if (user.length === 0) {
			return res.status(200).json({
				err_code: 1,
				message: '邮箱或密码不正确'
			})
		}
		req.session.user = user[0]
		return res.status(200).json({
			err_code: 0,
			message: '登录成功'
		})


	})

})

router.get('/register', (req, res) => {
	res.render('register.html')
})
router.post('/register', (req, res) => {
	// console.log(req.body)
	/* 		User.find((err, user)=>{
				if(err){
					console.log(err)
				}else{
					console.log(user)
				}
			}) */

	/* User.deleteMany({}, function(err, data) {
			if (err) {
				console.log(err)
			} else {
				// console.log(data)
				User.find(function(err, data) {
					if (err) {
						console.log(err)
					} else {
						console.log(data)
						// return res.render('index.html')
					}
				})
			}
		})
	 */

	User.findOne({
		// 只要用户名或者邮箱有一个存在，则不允许注册
		$or: [{
			email: req.body.email
		}, {
			nickname: req.body.nickname
		}]
	}, (err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '注册用户失败'
			})
		}
		if (user) {
			// 如果有返回来的数据，则表明在数据库中查到了，不能注册 
			return res.status(200).json({
				err_code: 1,
				message: '邮箱或用户名已经存在了'
			})
		}
		//如果没有返回来的数据，则表明在数据库中没有查到，可以注册
		// 对用户输入的密码进行二次加密
		req.body.password = md5(md5(req.body.password))
		req.body.secret = md5(md5(req.body.secret))
		new User(req.body).save((err, user) => {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '注册用户失败'
				})
			}
			// console.log(user)
			res.status(200).json({
				err_code: 0,
				message: '注册用户成功'
			})
		})
	})


})

router.get('/login/forget', (req, res) => {
	res.render('forget.html')
})
router.post('/login/forget', (req, res) => {
	// console.log(req.body)
	User.findOne({
		email: req.body.email
	}, (err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '邮箱查找失败'
			})
		}
		if (!user) {
			return res.status(200).json({
				err_code: 1,
				message: '邮箱不存在'
			})

		}
		User.findOne({
			email: req.body.email,
			secretQuestion: req.body.secretQuestion,
			secret: md5(md5(req.body.secret))
		}, (err, user) => {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '密保查找失败'
				})
			}
			if (!user) {
				return res.status(200).json({
					err_code: 1,
					message: '密保问题或密保答案不正确'
				})
			}
			return res.status(200).json({
				err_code: 0,
				email: req.body.email,
				message: '密保问题和密保答案验证成功'
			})
		})

	})

})

router.get('/login/forget/upPassword', (req, res) => {
	// console.log()
	res.render('upPassword.html', {
		email: req.query.email
	})
})
router.post('/login/forget/upPassword', (req, res) => {
	console.log(req.body)
	User.updateOne({
		email: req.body.email
	}, {
		password: md5(md5(req.body.password))
	}, (err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '密码更新失败'
			})
		} 
		return res.status(200).json({
			err_code: 0,
			message: '密码更新成功'
		})
	})

})

module.exports = router
