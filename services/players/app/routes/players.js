var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../config/log')(module),
	players = mongoose.model('Player'),
	validator = require('./../validators'), 
	passport = require('./../passport');

module.exports = function(app) {
	app.use('/api/players', router);
};

router.head('/live', function(req, res, next) {
	res.status(200).send({ status: "Ok", message: "I'm a live" });
});

/////////////////////////////////// GET REQUEST ///////////////////////////////////
// get all players
router.get('/', function(req, res, next) {
	passport.checkServiceAuthorization(req, res, function (scope) {
		let page = validator.checkInt(req.query.page);
		let count = validator.checkInt(req.query.count);
		page = validator.checkValue(page) ? page : 0;
		count = validator.checkValue(count) ? count : 0;

		players.getAll(page, count, function(err, result) {
			if (err) {
				log.error('Request \'getAll\': ' + err);
				res.status(400).send({ status: "Error", message: err, service: scope});
			}
			else {
				log.info('Request \'getAll\': completed');
				let temp = {
					content: result,
					service: scope
				}
				res.status(200).send(temp);
			}
		});
	});
});


// get player by id
router.get('/:id', function(req, res, next) {
	passport.checkServiceAuthorization(req, res, function (scope) {
		const id = req.params.id;
		players.getById(id, function(err, result) {
			if (err) {
				if (validator.checkValue(err.value)) {
					log.error('Request \'getById\': Incorrect ID');
					res.status(400).send({ status: "Error", message: "Incorrect ID", service: scope});
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
					res.status(200).send(temp); 
				}
				else {
					log.error('Request \'getById\': Player not found');
					res.status(404).send({ status: "Error", message: "Player not found", service: scope});	
				}
			}
		});
	});
});

/////////////////////////////////// POST REQUEST ///////////////////////////////////
// generate test players
router.post('/test_generate', function (req, res, next) {
	let name = ["Roberto", "Sanches", "Morata", "Bakary", "Handanovich", "Messi", "Rivaldo", "Jo", "Lee", "Yamaho"];
	let club = ["Juventus", "Arsenal", "Barselona", "Betis", "Chelsea", "Milan", "Inter", "Bayern", "Koln", "CSKA"];
	let count = validator.checkInt(req.query.count);
	count = validator.checkValue(count) ? count : 10; 
	for (let i = 0; i < count; i++){
		let player = new players({
			name  		: name[i % 10],
			club  		: club[(i * 3) % 10],
			age			: (i*30 + 18) % (45 - 18) + 18,	//Math.random(18, 45),
			rating    	: (i*30 + 18) % (99 - 45) + 45,	//Math.random(45, 100)
			contract: {
				date: Date.now(),
				years: (i % 6) + 1
			}
		});
		players.create(player, function(err, result){
			err ? next(err) : log.debug('Save new player \'' + result.name + '\'');
		});
	}
	log.info('Random players was created');
	res.status(201).json({ status: "Created", message: "Random players was created" });
});

/////////////////////////////////// PUT REQUEST ///////////////////////////////////
// update contract player by id
router.put('/:id/contract/', function(req, res, next) {
	passport.checkServiceAuthorization(req, res, function (scope) {
		const id = req.params.id;
		let data = {
			date: validator.parseDate(req.body.date), 
			years: validator.checkInt(req.body.years)
		};

		if (!validator.checkValue(data.date)) {
			log.error('Request \'updateContractById\':  Invalid parameter (date)');
			res.status(400).send({ status: "Error", message: "Invalid parameter (date)", service: scope});
		}
		else if (!validator.checkValue(data.years)) {
			log.error('Request \'updateContractById\': Invalid parameter (years)');
			res.status(400).send({ status: "Error", message: "Invalid parameter (years)", service: scope});
		}
		else {
			players.updateContractById(id, data, function(err, result) {
				if (err) {
					if (err.kind == "ObjectId") {
						log.error('Request \'updateContractById\': Incorrect ID');
						res.status(400).send({ status: "Error", message: "Incorrect ID", service: scope});
					} 
					else { 
						log.error('Request \'updateContractById\': ' + err);
						res.status(400).send({ status: "Error", message: err, service: scope});
					}
				}
				else {
					if (result) {
						log.info('Request \'updateContractById\': completed');
						let temp = {
							content: result,
							service: scope
						}
						res.status(200).send(temp);
					}
					else {
						log.error('Request \'updateContractById\': Player not found');
						res.status(404).send({ status: "Error", message: "Player not found", service: scope});	
					}
				} 
			});
		}
	});
});

// update player(club, contract) by id
router.put('/:id', function(req, res, next) {
	passport.checkServiceAuthorization(req, res, function (scope) {
		const id = req.params.id;
		let data = {
			clubTo: req.body.clubTo,
			date: validator.parseDate(req.body.date), 
			years: validator.checkInt(req.body.years)
		};

		if (!validator.checkValue(data.date)) {
			log.error('Request \'updateById\': Invalid parameter (date)');
			res.status(400).send({ status: "Error", message: "Invalid parameter (date)", service: scope});
		}
		else if (!validator.checkValue(data.years)) {
			log.error('Request \'updateById\': Invalid parameter (years)');
			res.status(400).send({ status: "Error", message: "Invalid parameter (years)", service: scope});
		}
		else if (!validator.checkValue(data.clubTo)) {
			log.error('Request \'updateById\': Invalid parameter (clubTo)');
			res.status(400).send({ status: "Error", message: "Invalid parameter (clubTo)", service: scope});
		}
		else {
			players.updateById(id, data, function(err, result) {
				if (err) {
					if (err.kind == "ObjectId") {
						log.error('Request \'updateById\': Incorrect ID');
						res.status(400).send({ status: "Error", message: "Incorrect ID", service: scope});
					} 
					else { 
						log.error('Request \'updateById\': ' + err);
						res.status(400).send({ status: "Error", message: err, service: scope});
					}
				}
				else {
					if (result) {
						log.info('Request \'updateById\': completed');
						let temp = {
							content: result,
							service: scope
						}
						res.status(200).send(temp);
					}
					else {
						log.error('Request \'updateById\': Player not found');
						res.status(404).send({ status: "Error", message: "Player not found", service: scope});	
					}
				} 
			});
		}
	});
});

/////////////////////////////////// DELETE REQUEST ///////////////////////////////////
// delete all data
router.delete('/', function(req, res, next) {
	players.delete(function(err, result){
		if (err) {
			log.info("Request \'deletePlayers\':" + err);
			res.status(400).send({status: "Error", message: err});
		}
		else {	
			log.info("Request \'deletePlayers\': All data was deleted");
			res.status(200).send({status: "Ok", message: "All data was deleted"});
		}
	});
});
