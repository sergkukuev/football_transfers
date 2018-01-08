var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Scout = new Schema({
	name: { 
		type: String,
		required: true 
	},
	amount: {
		deals: {
			type: Number,
			default: 0
		},
		contracts: {
			type: Number,
			default: 0
		}
	},
	rank: {
		type: Number,
		default: 0
	}
});

Scout.virtual('date').get(function() {
		return this._id.getTimestamp();
	});

Scout.statics.createScout = function(scout, callback) {
	scout.rank = calculateRank(scout.amount.deals);
	return scout.save(callback);
}

Scout.statics.getScouts = function(page = 0, count = 10, callback) {
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
	return this.findById(id, function(err, scout) {
		err ? callback(err, null) : (scout ? callback(null, getScoutInfo(scout)) : callback(null, null));
	});
}

Scout.statics.updateScout = function(id, data, callback) {
	console.log(data);
	return this.findByIdAndUpdate(id, { 
			amount:  {
				deals: data.deal,
				contracts: data.contract
			},
			rank: calculateRank(data.deal)
		}, function(err, scout) {
		err ? callback(err, null) : (scout ? callback(null, getScoutInfo(scout)) : callback(null, null));
	});
}

function calculateRank(deals) {
	let rank = 0;
	if (deals < 25)
		rank = 1;
	if (25 <= deals && deals < 50)
		rank = 2;
	if ( 50 <= deals && deals < 75)
		rank = 3;
	if (75 <= deals && deals < 100)
		rank = 4;
	if (deals >= 100)
		rank = 5
	return rank;
}

function getScoutInfo(scout) {
	let item = {
		"id"	: scout._id,
		"name"	: scout.name,
		"amount": {
			"deals": scout.amount.deals,
			"contracts": scout.amount.contracts
		},
		"rank"	: scout.rank
	};
	return item;
}

mongoose.model('Scout', Scout);