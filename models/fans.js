var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/Community', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
var Schema = mongoose.Schema
var fanSchema = new Schema({
	publisher_id:{
		type: String
	},
	fan_id:{
		type: String
	}
	
})
module.exports = mongoose.model('Fan', fanSchema)