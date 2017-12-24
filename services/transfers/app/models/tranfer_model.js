var mongoose = require('mongoose'), 
	log = require('./../../libs/log')(module);

let Schema = mongoose.Schema;

let Transfer = new Schema({
	ClubIN: {
		type: String, 
		default: 'NoClub'
	},
	ClubOUT: { 
		type: String,
		default: 'NoClub'
	},
	Cost: {
		type: Number,
		default: 0,
	},
	Contract: {
		StartDate: Date,
		EndDate: Date
	},
	PlayerID: Schema.Types.ObjectId,
	ScoutID: Schema.Types.ObjectId
});

Transfer.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

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
					for (let i = 0; I < orders.length; i++){
		        		let item = getTranfer(orders[i]);
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
	return findById(id, function(err, result) {
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

Transfer.statics.newTransfer = function(info, callback) {
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

function getTransfer(object) {
	let item = {
		ID: object._id,
		ClubIN: object.ClubIN,
		ClubOUT: object ClubOUT,
		Cost: object.Cost
		Contract: {
			StartDate: object.Contract.StartDate,
			EndDate: object.Contract.EndDate
		},
		PlayerID: object.PlayerID,
		ScoutID: object.ScoutID
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
			case 'StartDate':
				item.Contract.StartDate = new Date(object[key]);
				break;
			case 'EndDate':
				item.Contract.EndDate = new Date(object[key]);
				break;
			case 'ClubIN':
				item.ClubIN = new String(object[key]);
				break;
			case 'ClubOUT':
				item.ClubOUT = new String(object[key]);
				break;
			case 'cost':
				item.Cost = new String(object[key]);
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
	const requiredField = ['ClubIN', 'ClubOUT', 'Cost', 'StartDate', 'EndDate', 'PlayerID', 'ScoutID'];
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