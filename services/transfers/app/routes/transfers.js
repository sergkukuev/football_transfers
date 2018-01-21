var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	transfers = mongoose.model('Transfer'),
	validator = require('./../validators'),
	passport =require('./../passport');

module.exports = function(app) {
	app.use('/api/transfers', router);
};

router.head('/live', function(req, res, next) {
	res.status(200).send({ status: "Ok", message: "I'm a live" });
});

/////////////////////////////////// GET REQUEST ///////////////////////////////////
// get all transfers
router.get('/', function(req, res, next) {
	passport.checkServiceAuthorization(req, res, function (scope) {
		let page = validator.checkInt(req.query.page);
		let count = validator.checkInt(req.query.count);
		page = validator.checkValue(page) ? page : 0;
		count = validator.checkValue(count) ? count : 0;
		transfers.getAll(page, count, function(err, result) {
			if (err) {
				log.error('Request \'getAll\': ' + err);
				res.status(400).send({ status: "Error", message: err, service: scope});
			}
			else {
				log.info('Request \'getAll\': completed');
				let temp = {
					info: result,
					service: scope
				}
				res.status(200).send(temp);
			}
		});
	});
});

// get transfer by id
router.get('/:id', function(req, res, next) {
	passport.checkServiceAuthorization(req, res, function (scope) {
		const id = req.params.id;
		transfers.getById(id, function(err, result) {
			if (err) {
				if (err.kind == "ObjectId") {
					log.error('Request \'getById\': ID is invalid');
					res.status(400).send({ status: "Error", message: "Bad request: ID is invalid", service: scope});
				} 
				else { 
					log.error('Request \'getById\': ' + err);
					res.status(400).send({ status: "Error", message: err, service: scope});
				}
			}
			else {
				if (result) {
					log.info('Request \'getById\': completed');
					let temp = {
						content: result,
						service: scope
					}
					res.status(200).send(result); 
				}
				else {
					log.error('Request \'getById\': Transfer not found');
					res.status(404).send({ status: "Error", message: "Transfer not found", service: scope});	
				}
			}
		});
	});
});

/////////////////////////////////// POST REQUEST ///////////////////////////////////
// create transfer
router.post('/create', function(req, res, next) {
	return passport.checkServiceAuthorization(req, res, function (scope) {
		let data = {
			playerID: req.body.playerID,
			scoutID : req.body.scoutID,
			cost 	: validator.checkInt(req.body.cost),
			dateOfSign 	: validator.parseDate(req.body.date),
			clubFrom: req.body.clubFrom,
			clubTo 	: req.body.clubTo
		};

		let keys = [data.playerID, data.scoutID, data.dateOfSign, data.clubTo, data.clubFrom];
		let flag = 0;

		for (let i = 0; i < keys.length; i++)
			if (validator.checkValue(keys[i]))
				flag++;

		if (data.cost == 'undefined') {
			log.error('Request \'updateById\': Incorrect cost');
			res.status(400).send({ status: "Error", message: "Incorrect cost", service: scope});
		} else if (flag != keys.length) {
			log.error('Request \'create\': Incorrect one or more parameters');
			res.status(400).send({ status: "Error", message: "Incorrect one or more parameters",
				parameters: "playerID, scoutID, date, clubTo, clubFrom", service: scope });
		} 
		else {
			transfers.create(data, function(err, result) {
				if (err) {
					log.error('Request \'create\': ' + err);
					res.status(400).send({ status: "Error", message: err, service: scope});
				}
				else {
					if (result) {
						log.info('Request \'create\': completed');
						let temp = {
							info: result,
							service: scope
						}
						res.status(201).send(temp);
					}	
					else {
						log.error('Request \'create\': Transfer did not created');
						res.status(500).send({ status: "Error", message: "Transfer did not created", service: scope});
					}
				}
			});
		}
	});
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
			res.status(200).send({status: "Ok", message: "All data was deleted"});
		}
	});
});

// delete data by id
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
