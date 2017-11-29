var mongoose = require('mongoose'), 
	log = require('./../../libs/log')(module),
	config = require('./../../libs/config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function(err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback() {
	log.info("Connected to MongoDB");
});

let Schema = mongoose.Schema;

let Scout = new Schema({
	name: { 
		type: String,
		required: true 
	},
	club: { 
		type: String,
		default: 'NoClub'
	},
	age: { 
		type: Number,
		default: 18,
		min: 18,
		max: 70 
	},
	players: [String]
});

mongoose.model('Scout', Scout);