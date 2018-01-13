var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Player = new Schema({
	name: { 
		type: String,
		required: true 
	},
	club: { 
		type: String,
		default: "NoClub"
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
	}, 
	contract: {
		date: {
			type: Date,
			default: Date.now()
		},
		years: {
			type: Number,
			default: 3,
			min: 1, 
			max: 6
		}
	}
});

Player.virtual('date').get(function() {
		return this._id.getTimestamp();
	});

Player.statics.create = function(player, callback) {
	return player.save(callback);
}

Player.statics.delete = function(callback) {
	this.remove({}, function(err){
		if (err)
			callback(err, null);
		else
			callback(null, null);
	});
}

Player.statics.getAll = function(page = 0, count = 15, callback) {
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

Player.statics.getById = function(id, callback) {
	return this.findById(id, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
}

Player.statics.updateById = function(id, data, callback) {
	return this.findByIdAndUpdate(id, { 
			club: data.clubTo,
			contract: {
				date: data.date,
				years: data.years
			} 
		}, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
}

Player.statics.updateContractById = function(id, data, callback) {
	return this.findByIdAndUpdate(id, {
			contract: { 
				date: data.date,
				years: data.years
			} 
		}, function(err, player) {
		err ? callback(err, null) : (player ? callback(null, getPlayerInfo(player)) : callback(null, null));
	});
}

function getPlayerInfo(player) {
	let item = {
		"id"	: player._id,
		"name"	: player.name,
		"club"	: player.club,
		"age"	: player.age,
		"rating": player.rating,
		"contract": {
			"date": player.contract.date,
			"years": player.contract.years
		}
	};
	return item;
}

mongoose.model("Player", Player);