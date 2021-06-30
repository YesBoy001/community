var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/Community', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
var Schema = mongoose.Schema
var topicSchema = new Schema({
	title: {
	    type: String,
	    required: true
	},
	content: {
	    type: String,
	    required: true 
	}, 
	model: {
	    type: String
	},// 发行者
    publisher_id: {
        type: String
    },
    publisher: {
        type: String
    },
	 publisher_avatar: {
		type: String
	},
    createtime: {
        type: String
    },
	// 评论者
	comment_id: {
	    type: String
	},
	comment: {
	    type: String
	},
	comment_avatar: {
		type: String
	},
	commentTime: {
	    type: String
	},
    readNum: {
        type: Number,
        default: 0
    },
    like: {
        type: Number
    },
    dislike: {
        type: Number
    }
	
})
 module.exports = mongoose.model('Topic', topicSchema)
