var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	transfers = mongoose.model('Transfer'),
	validator = require('./../validators');

module.exports = function(app) {
	app.use('/transfers', router);
};

router.head('/live', function(req, res, next) {
	res.status(200).send({ status: "Ok", message: "I'm a live" });
});

/////////////////////////////////// GET REQUEST ///////////////////////////////////
// get all transfers
router.get('/', function(req, res, next) {
	let page = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page = validator.checkValue(page) ? page : 0;
	count = validator.checkValue(count) ? count : 0;
	transfers.getAll(page, count, function(err, result) {
		if (err) {
			log.error('Request \'getAll\': ' + err);
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
				log.error('Request \'getById\': ID is invalid');
				res.status(400).send({ status: "Error", message: "Bad request: ID is invalid"});
			} 
			else { 
				log.error('Request \'getById\': ' + err);
				res.status(400).send({ status: "Error", message: err});
			}
		}
		else {
			if (result) {
				log.info('Request \'getById\': completed');
				res.status(200).send(result); 
			}
			else {
				log.error('Request \'getById\': Transfer not found');
				res.status(404).send({ status: "Error", message: "Transfer not found"});	
			}
		}
	});
});

/////////////////////////////////// PUT REQUEST ///////////////////////////////////
router.put('/:id', function(req, res, next) {
	const id = req.params.id;
	let data = {
		cost: validator.checkInt(req.body.cost),
		date: validator.parseDate(req.body.date),
		clubTo: req.body.clubTo,
		clubFrom: req.body.clubFrom
	};

	let keys = Array.from(data);
	let flag = false;

	for (let i = 0; i < keys.length; i++)
		if (!validator.checkValue(keys[i]))
			flag = true;

	if (flag) {
		log.error('Request \'updateById\': Incorrect one or more parameters');
		res.status(400).send({ status: "Error", message: "Incorrect one or more parameters", 
			parameters: "cost, date, clubTo, clubFrom" });
	} 
	else {
		transfers.updateById(id, data, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.error('Request \'updateById\': Incorrect ID');
					res.status(400).send({ status: "Error", message: "Incorrect ID"});
				} 
				else { 
					log.error('Request \'updateById\': ' + err);
					res.status(400).send({ status: "Error", message: err});
				}
			}
			else {
				if (result) {
					log.error('Request \'updateById\': completed');
					res.status(200).send(result);
				}
				else {
					log.error('Request \'updateById\': Transfer not found');
					res.status(404).send({ status: "Error", message: "Transfer not found" });	
				}
			}	
		});
	}
});

/////////////////////////////////// POST REQUEST ///////////////////////////////////
// create transfer
router.post('/create', function(req, res, next) {
	let data = {
		playerID: req.body.playerID,
		scoutID : req.body.scoutID,
		cost 	: validator.checkInt(req.body.cost),
		dateOfSign 	: validator.parseDate(req.body.date),
		clubFrom: req.body.clubFrom,
		clubTo 	: req.body.clubTo
	};

	let keys = Array.from(data);
	let flag = false;

	for (let i = 0; i < keys.length; i++)
		if (!validator.checkValue(keys[i]))
			flag = true;

	if (flag) {
		log.error('Request \'create\': Incorrect one or more parameters');
		res.status(400).send({ status: "Error", message: "Incorrect one or more parameters",
			parameters: "playerID, scoutID, cost, date, clubTo, clubFrom" });
	} 
	else {
		transfers.create(data, function(err, result) {
			if (err) {
				log.error('Request \'create\': ' + err);
				res.status(400).send({ status: "Error", message: err});
			}
			else {
				log.error('Request \'create\': completed');
				res.status(201).send(result);	
			}
		});
	}
});


/////////////////////////////////// DELETE REQUEST ///////////////////////////////////
// delete all data
router.delete('/', function(req, res, next) {
	transfers.delete(function(err, result){
		if (err) {
			log.error("Request \'delete\':" + err);
			res.status(400).send({status: "Error", message: err.message});
		}
		else {	
			log.info("Request \'delete\': All data was deleted");
			res.status(200).send({status: "Error", message: "All data was deleted"});
		}
	});
});

// delete all data
router.delete('/:id', function(req, res, next) {
	const id = req.params.id;
	console.log(id);
	transfers.deleteById(id, function(err, result){
		if (err) {
			log.error("Request \'deleteById\':" + err);
			res.status(400).send({status: "Error", message: err});
		}
		else {	
			if (result) {
				log.info("Request \'deleteById\': Transfer \'" + id + "\' was deleted");
				res.status(200).send({status: "Error", message: "Transfer \'" + id + "\' was deleted"});
			}
			else {
				log.error("Request \'deleteById\': Transfer \'" + id + "\' not found");
				res.status(404).send({status: "Error", message: "Transfer \'" + id + "\' was not found"});	
			}
		}
	});
});
