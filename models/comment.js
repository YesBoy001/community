var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/Community', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
var Schema = mongoose.Schema
var topicSchema = new Schema({
	comment_nickname:{
		type: String
	},
	comment_id:{
		type: String
	},
	comment_content:{
		type: String
	},
	comment_avatar:{
		type: String
	},
	comment_time:{
		type: String
	},
	topic_id:{
		type: String
	},
	like: {
		type:Number,
		default: 0
	},
	dislike: {
		type:Number,
		default: 0
	}
	
})
 module.exports = mongoose.model('Comment', topicSchema)