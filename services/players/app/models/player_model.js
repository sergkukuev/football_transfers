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
	rating: {
		type: Number,
		default: 45,
		min: 45,
		max: 99
	}
});

Player.virtual('date').get(function() {
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
	return this.findById(id, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
}

Player.statics.getPlayerByName = function(surname, callback) {
	return this.findOne({ name: surname }, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
}

Player.statics.updatePlayer = function(id, clubTo, callback) {
	return this.findByIdAndUpdate(id, { club: clubTo}, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
}

Player.statics.updatePlayerByName = function(surname, clubTo, callback) {
	return this.findOneAndUpdate({ name: surname }, { club: clubTo }, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
} 

function getPlayerInfo(player) {
	let item = {
		'ID'	: player._id,
		'Name'	: player.name,
		'Club'	: player.club,
		'Age'	: player.age,
		'Rating': player.rating,
	};
	return item;
}

mongoose.model('Player', Player);