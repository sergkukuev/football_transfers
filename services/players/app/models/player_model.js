var mongoose = require('mongoose');

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
	rank: {
		type: Number,
		default: 45,
		max: 99
	}
});

Player.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

Player.statics.createPlayer = function(player, callback) {
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
			else
				callback(null, null);
		}
	}).skip(page * count).limit(count);
}

Player.statics.getPlayer = function(id, callback) {
	if (!id || typeof(id) == 'undefined' || id.length == 0) {
		return callback({ status: 'Error', message: 'ID is undefined'});
	};
	return this.findById(id, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
}

Player.statics.getPlayerByName = function(str, callback) {
	if (!str || typeof(str) == 'undefined' || str.length == 0) {
		return callback({ status: 'Error', message: 'Name is undefined'});
	};
	return this.find({
		name: str
	}).exec(function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
}

Player.statics.updatePlayer = function(id, clubTo, callback) {
	if (!id || typeof(id) == 'undefined' || id.length == 0) {
		return callback({ status: 'Error', message: 'ID is undefined'});
	};
	return this.findByIdAndUpdate(id, { club: clubTo}, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerName(player)) : callback(null, null));
	});
} 

function getPlayerInfo(player) {
	let item = {
		'ID'	: player._id,
		'Name'	: player.name,
		'Club'	: player.club,
		'Age'	: player.age,
		'Rank'	: player.rank,
	};
	return item;
}
function getPlayerName(player) {
	return player.name;
}

mongoose.model('Player', Player);