var mongoose = require('mongoose'), 
	log = require('./../../libs/log')(module),
	config = require('./../../libs/config');

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
	players: [Schema.Types.ObjectID]
});

Scout.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

Scout.statics.saveScout = function(scout, callback) {
	return scout.save(callback);
}

Scout.statics.getScouts = function(page = 0, count = 15, callback) {
	return this.find(function(err, scouts) {
		if (err)
			callback(err, null);
		else {
			if (scouts) {
				let result = [];
				for (let i = 0; i < scouts.length; i++)
					result[i] = getScoutsInfo(scouts[i]);
				callback(null, result);
			}
			else {
				callback(null, null);
			}
		}
	}).skip(page * count).limit(count);
}

Scout.statics.getScout = function(id, callback) {
	if (!id || typeof(id) == 'undefined' || id.length == 0) {
		return callback({ status: 'Error', message: 'ID is undefined'});
	};
	return this.findById(id, function(err, scout) {
		if (err)
			callback(err, null);
		else {
			if (scout) {
				let result = getScoutInfo(scout);
				callback(null, result);
			}
			else {
				callback(null, null);
			}
		}
	});
}

Scout.statics.getScoutPlayers = function(id, callback) {
	if (!id || typeof(id) == 'undefined' || id.length == 0) {
		return callback({ status: 'Error', message: 'ID is undefined'});
	};
	return this.findById(id, function(err, scout) {
		if (err)
			callback(err, null);
		else {
			if (scout) {
				let players = scout.players;
				callback(null, players);
			}
			else {
				callback(null, null);
			}
		}
	});
}

function getScoutInfo(scout) {
	let elem = {
		'ID'	: scout._id,
		'Name'	: scout.name,
		'Club'	: scout.club,
		'Age'	: scout.age
	};
	return elem;
}

mongoose.model('Scout', Scout);