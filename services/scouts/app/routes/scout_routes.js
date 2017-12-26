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
			res.status(400).send({ status: 'Error', message: err});
		}
		else {
			log.info('Request \'getScouts\' was successfully executed');
			res.status(200).send(result);
		}
	});
});

// get scout by name
router.get('/byname/:name', function(req, res, next) {
	const name = req.params.name;
	if (!validator.checkValue(name)) {
		log.debug('Request \'getScoutByName\': Name is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: Name is undefined'});
	}
	else {
		scouts.getScoutByName(name, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'getScoutByName\': Name is invalid');
					res.status(400).send({ status: 'Error', message: 'Bad request: Name is invalid'});
				} 
				else { 
					log.debug('Request \'getScoutByName\': Scout not found');
					res.status(400).send({ status: 'Error', message: 'Scout not found'});
				}
			}
			else {
				log.info('Request \'getScoutByName\' was successfully executed');
				res.status(200).send(result); 
			}
		});
	}
});

// get scout by id
router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	if (!validator.checkValue(id)) {
		log.debug('Request \'getScout\': ID is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	}
	else {
		scouts.getScout(id, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'getScout\': ID is invalid');
					res.status(400).send({ status: 'Error', message: 'Bad request: ID is invalid'});
				} 
				else { 
					log.debug('Request \'getScout\': Scout not found');
					res.status(400).send({ status: 'Error', message: 'Scout not found'});
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
			amountOfDeals	: (i * 43) % 100,
		});
		
		scouts.createScout(scout, function(err, result){
			err ? next(err) : log.debug('Save new scout \'' + result.name + '\'');
		});
	}
	log.info('Random ' + count + ' scouts was created');
	res.status(200).send({ message: 'Random ' + count + ' scouts was created' });
});

// update scout by name
router.put('/byname/:name', function(req, res, next) {
	const name = req.params.name;
	if (!validator.checkValue(name)) {
		log.debug('Request \'updateScoutByName\': Name is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: Name is undefined'});
	}
	else {
		scouts.getScoutByName(name, function(err, scout) {
			if (err) {
				log.debug('Request \'updateScout\': Name is invalid');
				res.status(400).send({ status: 'Error', message: 'Bad request: Name is invalid'});
			}
			else {
				scouts.updateScoutByName(name, scout.AmountOfDeals + 1, function(err, result) {
					if (err) {
						if (err.kind == "ObjectID") {
							log.debug('Request \'updateScoutByName\': Name is invalid');
							res.status(400).send({ status: 'Error', message: 'Bad request: Name is invalid'});
						} 
						else { 
							log.debug('Request \'updateScoutByName\': Scout not found');
							res.status(400).send({ status: 'Error', message: 'Scout not found'});
						}
					}
					else {
						log.info('Request \'updateScoutByName\' was successfully executed');
						res.status(200).send({message: result.Name + ' bargained'}); 
					}
				});
			}
		});
	}
});

// update scout by id
router.put('/:id', function(req, res, next) {
	const id = req.params.id;
	if (!validator.checkValue(id)) {
		log.debug('Request \'updateScout\': ID is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	}
	else {
		scouts.getScout(id, function(err, scout) {
			if (err) {
				log.debug('Request \'updateScout\': ID is invalid');
				res.status(400).send({ status: 'Error', message: 'Bad request: ID is invalid'});
			}
			else {
				scouts.updateScout(id, scout.AmountOfDeals + 1, function(err, result) {
					if (err) {
						if (err.kind == "ObjectID") {
							log.debug('Request \'updateScout\': ID is invalid');
							res.status(400).send({ status: 'Error', message: 'Bad request: ID is invalid'});
						} 
						else { 
							log.debug('Request \'updateScout\': Scout not found');
							res.status(400).send({ status: 'Error', message: 'Scout not found'});
						}
					}
					else {
						log.info('Request \'updateScout\' was successfully executed');
						res.status(200).send({message: result.Name + ' bargained'}); 
					}
				});
			}
		});
	}
});

router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});

