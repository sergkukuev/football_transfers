var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	scouts = mongoose.model('Scout'),
	validator = require('./../validators');

module.exports = function(app) {
	app.use('/scouts', router);
};

/////////////////////////////////// GET REQUEST ///////////////////////////////////

// get all scouts
router.get('/', function(req, res, next) {
	let page = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page = validator.checkValue(page) ? page : 0;
	count = validator.checkValue(count) ? count : 0;
	scouts.getScouts(page, count, function(err, result) {
		if (err) {
			log.debug('Request \'getScouts\': ' + err);
			res.status(400).send({ "message": err});
		}
		else {
			log.info('Request \'getScouts\' was successfully executed');
			res.status(200).send(result);
		}
	});
});

// get scout by id
router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	if (!validator.checkValue(id)) {
		log.debug('Request \'getScout\': ID is undefined');
		res.status(400).send({ "message": "Bad request: ID is undefined"});
	}
	else {
		scouts.getScout(id, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'getScout\': ID is invalid');
					res.status(400).send({ "message": "Bad request: ID is invalid"});
				} 
				else { 
					log.debug('Request \'getScout\': Scout not found');
					res.status(400).send({ "message": "Scout not found"});
				}
			}
			else {
				log.info('Request \'getScout\' was successfully executed');
				res.status(200).send(result); 
			}
		});
	}
});

/////////////////////////////////// PUT REQUEST ///////////////////////////////////
// generate test scouts
router.put('/test_generate', function (req, res, next) {
	let count = validator.checkInt(req.query.count);
	count = validator.checkValue(count) ? count : 10;
	for (let i = 0; i < count; i++){
		let scout = new scouts({
			name  			: 'Scout' + i.toString(),
			amount: {
				deals: (i * 43) % 100,
				contracts: (i * 43) % 100 
			}
		});
		
		scouts.createScout(scout, function(err, result){
			err ? next(err) : log.debug('Save new scout \'' + result.name + '\'');
		});
	}
	log.info('Random ' + count + ' scouts was created');
	res.status(200).send({ "message": "Random " + count + " scouts was created" });
});

// update deals scout by id
router.put('/:id/deals', function(req, res, next) {
	const id = req.params.id;
	if (!validator.checkValue(id)) {
		log.debug('Request \'updateScoutDeals\': ID is undefined');
		res.status(400).send({ "message": "Bad request: ID is undefined"});
	}
	else {
		scouts.getScout(id, function(err, scout) {
			if (err) {
				log.debug('Request \'updateScoutDeals\': ID is invalid');
				res.status(400).send({ "message": "Bad request: ID is invalid"});
			}
			else {
				let data = {
					deal: scout.amount.deals + 1,
					contract: scout.amount.contracts
				};
				scouts.updateScout(id, data, function(err, result) {
					if (err) {
						if (err.kind == "ObjectID") {
							log.debug('Request \'updateScoutDeals\': ID is invalid');
							res.status(400).send({ "message": "Bad request: ID is invalid"});
						} 
						else { 
							log.debug('Request \'updateScoutDeals\': Scout not found');
							res.status(400).send({ "message": "Scout not found"});
						}
					}
					else {
						log.info('Request \'updateScoutDeals\' was successfully executed');
						res.status(200).send({ "message": result.name + " made deal"}); 
					}
				});
			}
		});
	}
});

// update contracts scout by id
router.put('/:id/contracts', function(req, res, next) {
	const id = req.params.id;
	if (!validator.checkValue(id)) {
		log.debug('Request \'updateScoutDeals\': ID is undefined');
		res.status(400).send({ "message": "Bad request: ID is undefined"});
	}
	else {
		scouts.getScout(id, function(err, scout) {
			if (err) {
				log.debug('Request \'updateScoutContracts\': ID is invalid');
				res.status(400).send({ "message": "Bad request: ID is invalid"});
			}
			else {
				let data = {
					deal: scout.amount.deals,
					contract: scout.amount.contracts + 1
				};
				scouts.updateScout(id, data, function(err, result) {
					if (err) {
						if (err.kind == "ObjectID") {
							log.debug('Request \'updateScoutContracts\': ID is invalid');
							res.status(400).send({ "message": "Bad request: ID is invalid"});
						} 
						else { 
							log.debug('Request \'updateScoutContracts\': Scout not found');
							res.status(400).send({ "message": "Scout not found"});
						}
					}
					else {
						log.info('Request \'updateScoutContracts\' was successfully executed');
						res.status(200).send({ "message": result.name + " made contract"}); 
					}
				});
			}
		});
	}
});

router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});

