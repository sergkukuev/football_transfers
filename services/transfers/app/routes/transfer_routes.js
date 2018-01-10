var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	transfers = mongoose.model('Transfer'),
	validator = require('./../validators');

module.exports = function(app) {
	app.use('/transfers', router);
};

/////////////////////////////////// GET REQUEST ///////////////////////////////////
// get all transfers
router.get('/', function(req, res, next) {
	let page = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page = validator.checkValue(page) ? page : 0;
	count = validator.checkValue(count) ? count : 0;
	transfers.getAll(page, count, function(err, result) {
		if (err) {
			log.debug('Request \'getAll\': ' + err);
			res.status(400).send({ status: "Error", message: err});
		}
		else {
			log.info('Request \'getAll\': completed');
			res.status(200).send(result);
		}
	});
});

// get transfer by id
router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	transfers.getById(id, function(err, result) {
		if (err) {
			if (err.kind == "ObjectID") {
				log.debug('Request \'getById\': ID is invalid');
				res.status(400).send({ status: "Error", message: "Bad request: ID is invalid"});
			} 
			else { 
				log.debug('Request \'getById\': Transfer not found');
				res.status(400).send({ status: "Error", message: "Transfer not found"});
			}
		}
		else {
			log.info('Request \'getById\': completed');
			res.status(200).send(result); 
		}
	});
});

/////////////////////////////////// PUT REQUEST ///////////////////////////////////
router.put('/:id', function(req, res, next) {
	const id = req.params.id;
	let item = {
		cost: parseInt(req.body.Cost, 10),
		dateOfSign: validator.parseDate(req.body.DateOfSign),
		clubTo: req.body.ClubTo,
		clubFrom: req.body.ClubFrom
	};

	let keys = Array.from(item);
	let flag = false;

	for (let i = 0; i < keys.length; i++)
		if (!validator.checkValue(keys[i]))
			flag = true;

	if (!validator.checkValue(id)) {
		log.debug('Request \'updateTransfer\': ID is undefined');
		res.status(400).send({ status: "Error", message: "Bad request: ID is undefined"});
	}
	else if (flag) {
		log.debug('Request \'updateTransfer\': incorrect fields');
		res.status(400).send({ status: "Error", message: "Bad request: incorrect fields" });
	} else {
		transfers.updateTransfer(id, item, function(err, result) {
			if (err) {
				log.debug('Request \'updateTransfer\': ' + err);
				next(err);
			}
			else {
				if (result) {
					log.debug('Request \'updateTransfer\': completed');
					res.status(200).send(result);
				}
				else {
					log.debug('Request \'updateTransfer\': Transfer not found');
					res.status(400).send({ status: "Error", message: "Transfer not found" });	
				}
			}	
		});
	}
});

/////////////////////////////////// POST REQUEST ///////////////////////////////////
// create transfer
router.post('/create', function(req, res, next) {
	let item = {
		PlayerID: req.body.PlayerID,
		ScoutID: req.body.ScoutID,
		Cost: parseInt(req.body.Cost, 10),
		DateOfSign: validator.parseDate(req.body.DateOfSign),
		ClubFrom: req.body.ClubFrom,
		ClubTo: req.body.ClubTo
	};

	let keys = Array.from(item);
	let flag = false;

	for (let i = 0; i < keys.length; i++)
		if (!validator.checkValue(keys[i]))
			flag = true;

	if (flag) {
		log.debug('Request \'createTransfer\': Incorrect fields');
		res.status(400).send({ status: "Error", message: "Bad request: Incorrect fields" });
	} else {
		transfers.createTransfer(item, function(err, result) {
			if (err) {
				log.debug('Request \'createTransfer\': ' + err);
				next(err);
			}
			else {
				log.debug('Request \'createTransfer\': completed');
				res.status(200).send(result);	
			}
		});
	}
});


/////////////////////////////////// DELETE REQUEST ///////////////////////////////////
// delete all data
router.delete('/delete', function(req, res, next) {
	transfers.deleteTransfers(function(err, result){
		if (err) {
			log.info("Request \'deleteTransfers\':" + err);
			res.status(400).send({status: "Error", message: err.message});
		}
		else {	
			log.info("Request \'deleteTransfers\': Data was deleted");
			res.status(200).send({status: "Error", message: "Data was deleted"});
		}
	});
});
