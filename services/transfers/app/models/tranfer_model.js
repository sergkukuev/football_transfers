var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Transfer = new Schema({
	playerID: Schema.Types.ObjectId,
	scoutID: Schema.Types.ObjectId,
	cost: {
		type: Number,
		min: 0,
		default: 0
	},
	dateOfSign: {
		type: Date, 
		default: Date.now()
	},
	club: {
		from: String,
		to: {
			type: String,
			default: "NoClub"
		}
	}
});

Transfer.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

Transfer.statics.createTransfer = function(info, callback) {
	let object = Object(info);
	const check = checkRequiredFields(Object.keys(object));
	
	if (check) {
		let transfer = createTransfer(object);
		if (transfer) {
			return transfer.save(function (err, result) {
				if (err)
					return callback(err, null);
				else 
					return callback(null, getTransfer(result));
			});
		} else
			return callback("Incorrect transfer fields", null);
	} else
		return callback("Not found required fields", null);
};

Transfer.statics.deleteTransfers = function(callback) {
	this.remove({}, function(err){
		err ? callback(err, null) : callback(null, null);
	});
}

Transfer.statics.updateTransfer = function(id, data, callback) {
	return this.findByIdAndUpdate(id, {
		cost: data.cost,
		dateOfSign: data.dateOfSign,
		club: {
			from: data.clubFrom, 
			to: data.clubTo
		}
	}, function(err, transfer) {
		err ? callback(err, null) : (transfer ? callback(null, getTransfer(transfer)) : callback(null, null));
	});
};


Transfer.statics.getTransfers = function(page, count, callback){
	return this.find(function(err, transfers) {
		if (err)
			callback(err, null);
		else {
			if (transfers) {
				let result = [];
				for (let i = 0; i < transfers.length; i++) {
					let item = getTransfer(transfers[i]);
	        		result[i] = item;	
				}
	      		callback(null, result);
			} else
	      		callback(null, null);
	    }
  	}).skip(page * count).limit(count); 
};

Transfer.statics.getTransfer = function(id, callback) {
	return this.findById(id, function(err, result) {
		err ? callback(err, null) : (result ? callback(null, getTransfer(result)) : callback(null, null));
	});
};

function getTransfer(object) {
	let item = {
		"id"		: object._id,
		"playerID"	: object.playerID,
		"scoutID"	: object.scoutID,
		"cost"		: object.cost,
		"dateOfSign": object.dateOfSign,
		"club": {
			"from"	: object.club.from,
			"to"	: object.club.to
		}
	};
	return item;
}

function createTransfer(object) {
	const model = mongoose.model("Transfer");
	let result = new model();
	let error = false;

	for (key in object) {
		switch (key) {
			case "PlayerID":
				result.playerID = mongoose.Types.ObjectId(object[key]);
				break;
			case "ScoutID":
				result.scoutID = mongoose.Types.ObjectId(object[key]);
				break;
			case "Cost":
				result.cost = new Number(object[key]);
				break;
			case "ClubTo":
				result.club.to = new String(object[key]);
				break;
			case "ClubFrom":
				result.club.from = new String(object[key]);
				break;
			case "DateOfSign":
				result.dateOfSign = new Date(object[key]);
				break;
			default:
				error = true;
				break;
		}
	}
	if (error)
		return null;
	else
		return result;
}

function checkRequiredFields(objectKeys){
	const keys = Array.from(objectKeys);
	const requiredField = ["PlayerID", "ScoutID", "ClubFrom"];
	let flag = 0;
	
	for(let i = 0; i < keys.length; i++ )
		if (requiredField.indexOf(keys[i]) != -1)
	  		flag++;

	if (flag == requiredField.length)
		return true;
	else
		return false;
}

mongoose.model("Transfer", Transfer);