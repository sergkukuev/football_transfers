var mongoose = require('mongoose'), 
	log = require('./../../libs/log')(module),
	config = require('./../../libs/config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function(err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback() {
	log.info("Player service connected to MongoDB");
});

let Schema = mongoose.Schema;

let Player = new Schema({
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
		max: 45 
	},
	cost: {
		type: Number,
		default: 0,
	},
	rank: {
		type: Number,
		default: 45,
		max: 100
	},
	potential: {
		type: Number,
		default: 99,
		min: 45,
		max: 100
	}
});

Player.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

Player.statics.savePlayer = function(player, callback) {
	return player.save(callback);
}

Player.statics.getPlayers = function(page = 0, count = 15, callback) {
	return this.find(function(err, players) {
		if (err)
			callback(err, null);
		else {
			if (players) {
				let result = [];
				for (let i = 0; i < players.length; i++)
					result[i] = getPlayerInfo(players[i]);
				callback(null, result);
			}
			else {
				callback(null, null);
			}
		}
	}).skip(page * count).limit(count);
}

Scout.statics.getPlayer = function(id, callback) {
	if (!id || typeof(id) == 'undefined' || id.length == 0) {
		return callback({ status: 'Error', message: 'ID is undefined'});
	};
	return this.findById(id, function(err, player) {
		if (err)
			callback(err, null);
		else {
			if (scout) {
				let result = getPlayerInfo(player);
				callback(null, result);
			}
			else {
				callback(null, null);
			}
		}
	});
}

function getPlayerInfo(player) {
	let elem = {
		'ID'	: player._id,
		'Name'	: player.name,
		'Club'	: player.club,
		'Cost'	: player.cost,
		'Age'	: player.age,
		'Rank'	: player.rank,
		'Potential': player.potential
	};
	return elem;
}

mongoose.model('Player', Player);