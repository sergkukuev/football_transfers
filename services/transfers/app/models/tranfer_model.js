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
	club: {
		from: {
			type: String,
			default: 'NoClub'
		},
		to: {
			type: String,
			default: 'NoClub'
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

Transfer.statics.getTransfers = function(page, count, callback){
	if (page < 0 || typeof(page) == 'undefined' || count <= 0 || typeof(count) == 'undefined')
		return callback('incorrect page and count', null);
	else {
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
	}
};

Transfer.statics.getTranfer = function(id, callback) {
	return this.findById(id, function(err, result) {
		if (err)
			return callback(err, null);
		else {
			if (result) {
				let transfer = getTransfer(result);
				return callback(null, transfer);
			} 
			else
				return callback(null, null);
		}
	});
};

function getTransfer(object) {
	let item = {
		ID: object._id,
		PlayerID: object.PlayerID,
		ScoutID: object.ScoutID,
		cost: object.Cost,
		dateOfSign: object.dateOfSign,
		club: {
			from: object.club.from,
			to: object.club.to
		}
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
			case 'ClubFrom':
				item.club.from = new String(object[key]);
				break;
			case 'ClubTo':
				item.club.to = new String(object[key]);
				break;
			case 'DateOfSign':
				item.dateOfSign = new String(object[key]);
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
	const requiredField = ['PlayerID', 'ScoutID', 'Cost', 'DateOfSign', 'ClubFrom', 'ClubTo'];
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