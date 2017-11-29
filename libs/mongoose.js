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
// Скауты
var Scout = new Schema({
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

// Игрочишки
var Player = new Schema({
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
		default: 16, 
		min: 16, 
		max: 45 
	};
	rank: { 
		type: Number, 
		default: 60, 
		min: 40, 
		max: 100 
	}, 
	potential: { 
		type: Number, 
		default: 60, 
		min: 60,
		 max: 100 
	},
	cost: { 
		type: Number,
		default: 0
	}
});

// История трансферов
var Transfer = new Schema({
	player: { 
		type: String, 
		required: true 
	},
	scout: { 
		type: String, 
		defeault: 'NoScout'
	},
	from: { 
		type: String, 
		default: 'NoClub' 
	},
	to: { 
		type: String, 
		required: true 
	},
	spending: { 
		type: Number, 
		default: 0 
	}
});

// Валидация
Player.path('name').validate(function (v) {
	return v.length > 1 && v.length < 50
});

Scout.path('name').validate(function (v) {
	return v.length > 1 && v.length < 50
});

Transfer.path('player').validate(function (v) {
	return v.length > 1 && v.length < 50
});

Transfer.path('scout').validate(function (v) {
	return v.length > 1 && v.length < 50
});

var ScoutModel = mongoose.model('Scout', Scout);
var PlayerModel = mongoose.model('Player', Player);
var TransferModel = mongoose.model('Transfer', Transfer);

module.exports.ScoutModel = ScoutModel;
module.exports.PlayerModel = PlayerModel;
module.exports.TransferModel = TransferModel;