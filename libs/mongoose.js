var mongoose = require('mongoose');
var log = require('./log')(module);
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function(err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback() {
	log.info("Connected to MongoDB");
});

var Schema = mongoose.Schema;

// Схемы
var Scout = new Schema({
	name: { type: String, required: true },
	club: { type: String, default: 'NoClub' },
	age: { type: Number, default: 18 },
	players: [String]
});

var Player = new Schema({
	name: { type: String, required: true },
	club: { type: String, default: 'NoClub' },
	age: { type: Number, default: 16, min: 16, max: 45 };
	rank: { type: Number, default: 60, min: 40, max: 100 }, 
	potential: { type: Number, default: 60, min: 60, max: 100 },
	cost: { type: Number, default: 0}
});

var Transfer = new Schema({
	//players
	//scouts
	from: { type: String, default: 'NoClub' },
	to: { type: String, required: true },
	spending: { type: Number, default: 0 }
});

// Валидация 
/*Article.path('title').validate(function (v) {
	return v.length > 5 && v.length < 70;
});

var ArticleModel = mongoose.model('Article', Article);

module.exports.ArticleModel = ArticleModel;*/