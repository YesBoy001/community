var express = require('express')
var User = require('../models/user')
var Topic = require('../models/topic')
var Comment = require('../models/comment')
var Fan = require('../models/fans')
var md5 = require('blueimp-md5')
var router = express.Router()

router.get('/', (req, res) => {
	Topic.find((err, topic) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '个人信息更新失败'
			})
		}
		return res.render('index.html', {
			user: req.session.user,
			topic: topic,
			all: 'current-tab'
		})
	})
})
router.get('/share', (req, res) => {
	Topic.find({
		model: '分享'
	}, (err, topic) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '个人信息更新失败'
			})
		}
		return res.render('index.html', {
			user: req.session.user,
			topic: topic,
			share: 'current-tab'
		})
	})
})
router.get('/ask', (req, res) => {
	Topic.find({
		model: '问答'
	}, (err, topic) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '个人信息更新失败'
			})
		}
		return res.render('index.html', {
			user: req.session.user,
			topic: topic,
			ask: 'current-tab'
		})
	})
})
router.get('/job', (req, res) => {
	Topic.find({
		model: '招聘'
	}, (err, topic) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '个人信息更新失败'
			})
		}
		return res.render('index.html', {
			user: req.session.user,
			topic: topic,
			job: 'current-tab'
		})
	})
})
router.get('/dev', (req, res) => {
	Topic.find({
		model: '客户端测试'
	}, (err, topic) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '个人信息更新失败'
			})
		}
		return res.render('index.html', {
			user: req.session.user,
			topic: topic,
			dev: 'current-tab'
		})
	})
})


router.get('/stetings/profile', (req, res) => {
	res.render('settings/profile.html', {
		user: req.session.user,
		active: true
	})
})
router.post('/stetings/profile', (req, res) => {
	User.updateOne({
		email: req.body.email
	}, {
		nickname: req.body.nickname,
		bio: req.body.bio,
		gender: req.body.gender,
		birthday: req.body.birthday,
		avatar: req.body.avatar,
	}, (err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '个人信息更新失败'
			})
		}
		req.session.user.nickname = req.body.nickname
		req.session.user.bio = req.body.bio
		req.session.user.gender = req.body.gender
		req.session.user.birthday = req.body.birthday
		req.session.user.avatar = req.body.avatar
		User.findOne({
			email: req.body.email
		}, (err, user) => {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '个人信息更新失败'
				})
			}
			Topic.updateMany({
				publisher_id: user._id
			}, {
				publisher_avatar: req.body.avatar,
				publisher: req.body.nickname
			}, (err, users) => {
				if (err) {
					return res.status(500).json({
						err_code: 500,
						message: '个人信息更新失败'
					})
				}
				/* return res.status(200).json({
					err_code: 0,
					message: '个人信息更新成功'
				}) */
				Topic.updateOne({
					comment_id: user._id
				}, {
					comment_avatar: req.body.avatar,
					comment: req.body.nickname
				}, (err, user) => {
					if (err) {
						return res.status(500).json({
							err_code: 500,
							message: '个人信息更新失败'
						})
					}
					return res.status(200).json({
						err_code: 0,
						message: '个人信息更新成功'
					})
				})
			})
		})


		/* 	return res.status(200).json({
				err_code: 0,
				message: '个人信息更新成功'
			}) */
	})
})
router.get('/settings/admin', (req, res) => {
	res.render('settings/admin.html', {
		user: req.session.user
	})
})

router.post('/changePwd', (req, res) => {
	// console.log(req.body)
	User.findOne({
		email: req.body.email,
		password: md5(md5(req.body.password))
	}, (err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务器错误'
			})
		}
		if (user === null) {
			return res.status(200).json({
				err_code: 1,
				message: '更改密码时邮箱或密码验证错误'
			})
		}
		return res.status(200).json({
			err_code: 0,
			message: '更改密码时邮箱和密码验证正确'
		})
	})
})

router.post('/changepwd1', (req, res) => {
	// console.log(req.body)
	User.updateOne({
		email: req.body.email
	}, {
		password: md5(md5(req.body.password))
	}, (err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务器错误'
			})
		}
		return res.status(200).json({
			err_code: 0,
			message: '更改密码时邮箱和密码验证正确'
		})
	})
})
router.post('/delect', (req, res) => {
	// console.log(req.body)
	User.deleteOne({
		email: req.body.email
	}, (err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务器错误'
			})
		}
		req.session.user = null
		return res.status(200).json({
			err_code: 1,
			message: '服务器错误'
		})
	})
})
router.get('/logout', (req, res) => {
	req.session.user = null
	res.redirect('/login')
})
router.get('/removedata', (req, res) => {

	Comment.deleteMany({}, function(err, data) {
		if (err) {
			console.log(err)
		} else {

			Comment.find(function(err, data) {
				if (err) {
					console.log(err)
				} else {
					console.log(data)
					return res.render('index.html')
				}
			})
		}
	})
})


module.exports = router
