var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	transfers = mongoose.model('Transfer'),
	validator = require('./../validator/transfer_validator');

module.exports = function(app) {
	app.use('/transfers', router);
};

// get all transfers
router.get('/', function(req, res, next) {
	let page  = validator.checkIntNumber(req.query.page);
	let count = validator.checkIntNumber(req.query.count);
	page  = (typeof(page)   != 'undefined') ? page : 0;
	count = (typeof(count)  != 'undefined') ? count : 20;
	transfers.getTransfers(page, count, function(err, transfers) {
		if (err) {
			(err.kind == 'ObjectId') ?
				res.status(400).send({status : 'Error', message : 'Bad request : Invalid ID'}) : 
				res.status(400).send({status : 'Error', message : err});
		} else {
			(orders) ? res.status(200).send(orders) :
				res.status(404).send({status : 'Error', message : 'Not found transfers'});
			}
		}
	});
});

// get transfer information by id
router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	if (!id || typeof(id) == 'undefined' || id.length == 0) {
		res.status(400).send({status : 'Error', message : 'Bad request : Invalid ID'});
	} else {
		orders.getTransfer(id, function(err, order){
			if (err) {
				(err.kind == 'ObjectId') ?
					res.status(400).send({status : 'Error', message : 'Bad request : Invalid ID'}) : 
					res.status(400).send({status : 'Error', message : err});
			} else {
				(order) ?
					res.status(200).send(order) :
					res.status(404).send({status:'Error', message : "Transfers is not found"});
			}
		});
	}
});

// create transfer
router.put('/new_transfer', function(req, res, next) {
	let item = {
		ClubIN: req.body.clubIN,
		ClubOUT: req.body.clubOUT,
		cost: req.body.cost,
		StartDate: validator.ConvertStringToDate(req.body.startDate),
		EndDate: validator.ConvertStringToDate(req.body.endDate),
		PlayerID: req.body.PlayerID,
		ScoutID: req.body.ScoutID
	};

	if (!item.PlayerID  || typeof(item.PlayerID) == 'undefined' || item.PlayerID.length == 0 ||
      !item.ScoutID   || typeof(item.ScoutID) == 'undefined'  || item.ScoutID.length == 0 ||
      !item.StartDate || typeof(item.StartDate) == 'undefined' || item.StartDate.length == 0 ||
      !item.EndDate || typeof(item.EndDate) == 'undefined' || item.EndDate.length == 0 ||
      !item.EndDate || typeof(item.EndDate) == 'undefined' || item.EndDate.length == 0 ||
      !item.EndDate || typeof(item.EndDate) == 'undefined' || item.EndDate.length == 0 ||
      !item.EndDate || typeof(item.EndDate) == 'undefined' || item.EndDate.length == 0) {
		res.status(400).send('Bad request');
	} else {
		transfers.newTransfer(item, function(err, result) {
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