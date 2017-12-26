var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Transfer = new Schema({
	PlayerID: Schema.Types.ObjectId,
	ScoutID: Schema.Types.ObjectId,
	cost: {
		type: Number,
		min: 0,
		default: 0
	},
	dateOfSign: Date,
	clubTo: {
		type: String,
		default: 'NoClub'
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
				else {
					let res = getTransfer(result);
					return callback(null, res);
				}
			});
		} else
			return callback('Incorrect transfer fields', null);
	} else
		return callback('Not found required fields', null);
};

Transfer.statics.updateTransfer = function(id, info, callback) {
	return this.findByIdAndUpdate(id, {
		cost: info.Cost,
		dateOfSign: info.DateOfSign,
		clubTo: info.ClubTo
	}, function(err, transfer) {
		err ? callback(err, null) : (transfer ? callback(null, getTransfer(transfer)) : callback(null, null));
	});
};


Transfer.statics.getTransfers = function(page, count, callback){
	return this.find( function(err, transfers) {
		if (err)
			callback(err, null);
		else {
			if (transfers) {
				let result = [];
				for (let i = 0; i < transfers.length; i++){
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
		'ID'		: object._id,
		'PlayerID'	: object.PlayerID,
		'ScoutID'	: object.ScoutID,
		'Cost'		: object.cost,
		'DateOfSign': object.dateOfSign,
		'ClubTo'	: object.clubTo
	};
	return item;
}

function createTransfer(object) {
	const model = mongoose.model('Transfer');
	let item = new model();
	let error = false;

	for (key in object) {
		switch (key) {
			case 'PlayerID':
				item.PlayerID = mongoose.Types.ObjectId(object[key]);
				break;
			case 'ScoutID':
				item.ScoutID = mongoose.Types.ObjectId(object[key]);
				break;
			case 'Cost':
				item.cost = new Number(object[key]);
				break;
			case 'ClubTo':
				item.clubTo = new String(object[key]);
				break;
			case 'DateOfSign':
				item.dateOfSign = new Date(object[key]);
				break;
			default:
				error = true;
				break;
		}
	}
	if (error)
		return null;
	else
		return item;
}

function checkRequiredFields(objectKeys){
	const keys = Array.from(objectKeys);
	const requiredField = ['PlayerID', 'ScoutID', 'Cost', 'DateOfSign', 'ClubTo'];
	let flag = 0;
	
	for(let i = 0; i < keys.length; i++ )
		if (requiredField.indexOf(keys[i]) != -1)
	  		flag++;

	if (flag == requiredField.length)
		return true;
	else
		return false;
}

mongoose.model('Transfer', Transfer);