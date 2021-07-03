var express = require('express')
var Topic = require('../models/topic')
var User = require('../models/user')
var Fan = require('../models/fans')
var Comment = require('../models/comment')
var router = express.Router()

router.get('/topic/new', (req, res) => {
	// console.log(req.query)
	res.render('topic/new.html', {
		user: req.session.user
	})
})
router.post('/topic/new', (req, res) => {
	// console.log(req.body)
	new Topic(req.body).save((err, user) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '存入发表内容失败'
			})
		}
		return res.status(200).json({
			err_code: 0,
			message: '发表成功'
		})

	})

})

router.get('/topic/show', (req, res) => {
	
	req.query.topic_id = req.query.topic_id.replace(/"/g, '')
	// console.log(req.query.publisher_id)
	Topic.findOne({
		_id: req.query.topic_id
	}, (err, topic) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务器错误'
			})
		}

		let readNum = topic.readNum + 1
		let publisher_id = topic.publisher_id
		Topic.updateOne({
			_id: req.query.topic_id
		}, {
			readNum
		}, (err, user) => {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '服务器错误'
				})
			}

			User.findOne({
				_id: publisher_id
			}, (err, user) => {
				if (err) {
					return res.status(500).json({
						err_code: 500,
						message: '服务器错误'
					})
				}

				// console.log(req.session.user._id)
				// console.log(user)
				Comment.find({
					topic_id: req.query.topic_id
				}, (err, comment) => {
					if (err) {
						return res.status(500).json({
							err_code: 500,
							message: '服务器错误'
						})
					}

					res.render('topic/show.html', {
						user: req.session.user,
						topic: topic,
						p_user: user,
						comment
					})
				})
			})

		})


	})

})

router.post('/comment', (req, res) => {
	// console.log(1212121)
	// console.log(req.body)

	new Comment(req.body).save((err, comment) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务器错误'
			})
		}
		Topic.updateOne({
			_id: req.body.topic_id
		}, {
			comment_id: req.body.comment_id,
			comment_avatar: req.body.comment_avatar,
			commentTime: req.body.comment_time
		}, function(err, data) {
			if (err) {
				return res.status(500).json({
					err_code: 1,
					message: err
				})
			}
			res.status(200).json({
				err_code: 0,
				message: '发表内容存入成功'
			})
		})
		// return res.status(200).json({
		// 	err_code: 0,
		// 	message: '评论成功'
		// })
	})
})

router.post('/findcomment', (req, res) => {
	// console.log(req.body.topicId.trim())

	Comment.find({
		topic_id: req.body.topicId.trim()
	}, (err, comment) => {
		if (err) {
			// console.log(err)
			return res.status(500).json({
				err_code: 500,
				message: '查询评论服务器错误'
			})
		}
		// console.log(comment)
		return res.status(200).json({
			err_code: 1,
			message: '查询评论成功',
			data: comment
		})
	})
})
router.get('/pgetfan', (req, res) => {
	// console.log(req.query)
	if (!req.session.user) {
		return res.status(200).json({
			err_code: 1,
			message: '没有登录'
		})
	}
	return res.status(200).json({
		err_code: 0,
		message: '已经登录了',
		user: req.session.user
	})
})
router.get('/getfan', (req, res) => {
	// console.log(1314)
	// console.log(req.query)
	//  publisher_id: '60d32de5627bb12d4c9a4b73',
	// fan_id: '60d2d8155e0ca40e58709f78'
	if (req.query.publisher_id === req.query.fan_id) {
		return res.status(200).json({
			err_code: 0,
			message: '您不能自己关注自己哦'
		})
	}

	Fan.find({
		publisher_id: req.query.publisher_id,
		fan_id: req.query.fan_id
	}, function(err, data) {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '粉丝数据库查询失败'
			})
		} else {
			// console.log(data)
			if (data.length === 0) {
				// 说明没有关注过
				new Fan(req.query).save(function(err, fan) {
					if (err) {
						return res.status(500).json({
							err_code: 500,
							message: '存入粉丝数据失败'
						})
					}
					User.findById(req.query.publisher_id, (err, user) => {
						if (err) {
							return res.status(500).json({
								err_code: 500,
								message: '存入粉丝时用户数据查询失败'
							})
						}
						let fan = user.fan + 1
						User.updateOne({
							_id: req.query.publisher_id
						}, {
							fan: fan
						}, (err, gfan) => {
							if (err) {
								return res.status(500).json({
									err_code: 500,
									message: '更新用户的关注人数时失败'
								})
							}
							User.findById(req.query.publisher_id, (err,
								data) => {
								if (err) {
									return res.status(500).json({
										err_code: 500,
										message: '存入粉丝时用户数据查询失败1'
									})
								}
								return res.status(200).json({
									err_code: 1,
									message: '关注成功',
									fan: data.fan
								})
							})

						})


					})
				})

			} else {
				return res.status(200).json({
					err_code: 1,
					message: '您已经关注过啦'
				})
			}
		}
	})


})
router.post('/show/like', (req, res) => {

	if (!req.session.user) {
		return res.status(200).json({
			err_code: 2,
			message: '您还没有登录，请先登录'
		})
	}
	// console.log(req.body)
	req.body.comment_likeId = req.body.comment_likeId.replace(/"/g, '')
	// console.log(req.body)
	Comment.find({
		_id: req.body.comment_likeId
	}, (err, comment) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '更新喜欢人数时评论查询失败'
			})
		}
		let like = comment[0].like + 1
		Comment.updateOne({
			_id: req.body.comment_likeId
		}, {
			like: like
		}, (err, comment) => {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '更新喜欢人数时评论查询失败'
				})
			}
			Comment.find({
				_id: req.body.comment_likeId
			}, (err, comment) => {
				if (err) {
					return res.status(500).json({
						err_code: 500,
						message: '更新喜欢人数时评论查询失败'
					})
				}
				return res.status(200).json({
					err_code: 1,
					message: '点赞成功',
					like: comment[0].like
				})
			})

		})
	})
})

router.post('/show/dislike', (req, res) => {

	if (!req.session.user) {
		return res.status(200).json({
			err_code: 2,
			message: '您还没有登录，请先登录'
		})
	}
	// console.log(req.body)
	req.body.comment_dislikeId = req.body.comment_dislikeId.replace(/"/g, '')
	// console.log(req.body)
	Comment.find({
		_id: req.body.comment_dislikeId
	}, (err, comment) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '更新喜欢人数时评论查询失败'
			})
		}
		let dislike = comment[0].dislike + 1
		Comment.updateOne({
			_id: req.body.comment_dislikeId
		}, {
			dislike: dislike
		}, (err, comment) => {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '更新喜欢人数时评论查询失败'
				})
			}
			Comment.find({
				_id: req.body.comment_dislikeId
			}, (err, comment) => {
				if (err) {
					return res.status(500).json({
						err_code: 500,
						message: '更新喜欢人数时评论查询失败'
					})
				}
				return res.status(200).json({
					err_code: 1,
					message: '点赞成功',
					dislike: comment[0].dislike
				})
			})

		})
	})
})

router.post('/search', (req, res) => {
	// console.log(req.body)
	Topic.find({
		title: req.body.q
	}, (err, topic) => {
		if (err) {
			console.log(err)
			return res.status(500).json({
				err_code: 500,
				message: '标题搜索失败'
			})
		}
		if (topic.length === 0) {
			return res.status(200).json({
				err_code: 0,
				message: '没有该文章哦'
			})
		} 
		return res.render('index.html', {
			user: req.session.user,
			topic: topic
			// share: 'current-tab'
		})

	})
})
module.exports = router
