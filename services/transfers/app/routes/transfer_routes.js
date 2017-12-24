var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	TransferSystem = mongoose.model('Transfer'),
	validator = require('./../validators/transfer_validator');

module.exports = function(app) {
	app.use('/transfers', router);
};

// get all transfers
router.get('/', function(req, res, next) {
	let page  = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page  = (typeof(page)   != 'undefined') ? page : 0;
	count = (typeof(count)  != 'undefined') ? count : 20;
	TransferSystem.getTransfers(page, count, function(err, transfers) {
		if (err) {
			(err.kind == 'ObjectId') ?
				res.status(400).send({status : 'Error', message : 'Bad request : Invalid ID'}) : 
				res.status(400).send({status : 'Error', message : err});
		} else {
			transfers ? res.status(200).send(transfers) :
				res.status(404).send({status : 'Error', message : 'Not found transfers'});
		}
	});
});

// get transfer information by id
router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	if (!id || typeof(id) == 'undefined' || id.length == 0) {
		res.status(400).send({status : 'Error', message : 'Bad request : Invalid ID'});
	} else {
		orders.getTransfer(id, function(err, transfer){
			if (err) {
				(err.kind == 'ObjectId') ?
					res.status(400).send({status : 'Error', message : 'Bad request : Invalid ID'}) : 
					res.status(400).send({status : 'Error', message : err});
			} else {
				(order) ?
					res.status(200).send(transfer) :
					res.status(404).send({status:'Error', message : "Transfers is not found"});
			}
		});
	}
});

// create transfer
router.put('/create', function(req, res, next) {
	let item = {
		PlayerID: req.body.PlayerID,
		ScoutID: req.body.ScoutID,
		Cost: parseInt(req.body.Cost, 10),
		DateOfSign: validator.parseDate(req.body.DateOfSign),
		ClubFrom: req.body.ClubFrom,
		ClubTo: req.body.ClubTo
	};

	if (!item.PlayerID  || typeof(item.PlayerID) == 'undefined' || item.PlayerID.length == 0 ||
      !item.ScoutID   || typeof(item.ScoutID) == 'undefined'  || item.ScoutID.length == 0 ||
      !item.Cost || typeof(item.Cost) == 'undefined' || item.Cost.length == 0 ||
      !item.DateOfSign || typeof(item.DateOfSign) == 'undefined' || item.DateOfSign.length == 0 ||
      !item.ClubFrom || typeof(item.ClubFrom) == 'undefined' || item.ClubFrom.length == 0 ||
      !item.ClubTo || typeof(item.ClubTo) == 'undefined' || item.ClubTo.length == 0) {
		res.status(400).send('Bad request: incorrect fields');
	} else {
		TransferSystem.createTransfer(item, function(err, result) {
			if (err)
				return next(err);
			else {
				result ? res.status(201).send(result) : res.status(500).send('Something went wrong');
			}
		});
	}
});

// delete transfer by id
// later (may be)