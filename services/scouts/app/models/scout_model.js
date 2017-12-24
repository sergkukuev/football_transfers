var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Scout = new Schema({
	name: { 
		type: String,
		required: true 
	},
	amountOfDeals: {
		type: Number,
		default: 0
	},
	rank: {
		type: Number,
		default: 0
	}
});

Scout.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

Scout.statics.createScout = function(scout, callback) {
	scout.rank = calculateRank(scout.amountOfDeals);
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
					result[i] = getScoutInfo(scouts[i]);
				callback(null, result);
			}
			else
				callback(null, null);
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
		else
			scout ? callback(null, getScoutInfo(scout)) : callback(null, null);
	});
}

function calculateRank(amountOfDeals) {
	let rank = 0;
	if (amountOfDeals < 25)
		rank = 1;
	if (25 <= amountOfDeals && amountOfDeals < 50)
		rank = 2;
	if ( 50 <= amountOfDeals && amountOfDeals < 75)
		rank = 3;
	if (75 <= amountOfDeals && amountOfDeals < 100)
		rank = 4;
	if (amountOfDeals >= 100)
		rank = 5
	return rank;
}

function getScoutInfo(scout) {
	let item = {
		'ID'	: scout._id,
		'Name'	: scout.name,
		'amountOfDeals' : scout.amountOfDeals,
		'Rank'	: scout.rank
	};
	return item;
}

mongoose.model('Scout', Scout);