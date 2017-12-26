var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	players = mongoose.model('Player'),
	validator = require('./../validators');

module.exports = function(app) {
	app.use('/players', router);
};

/////////////////////////////////// GET REQUEST ///////////////////////////////////
// get all players
router.get('/', function(req, res, next) {
	let page = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page = validator.checkValue(page) ? page : 0;
	count = validator.checkValue(count) ? count : 0;
	players.getPlayers(page, count, function(err, result) {
		if (err) {
			log.debug('Error: ' + err);
			res.status(400).send({ status: 'Error', message: err});
		}
		else {
			log.info('Request \'getPlayers\' was successfully executed');
			res.status(200).send(result);
		}
	});
});

// get player by name
router.get('/byname/:name', function(req, res, next) {
	const name = req.param.name;
	if (!validator.checkValue(name)) {
		log.debug('Request \'getPlayerByName\': Name is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: Name is undefined'});
	}
	else {
		players.getPlayer(name, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'getPlayerByName\': Name is invalid');
					res.status(400).send({ status: 'Error', message: 'Bad request: Name is invalid'});
				} 
				else { 
					log.debug('Request \'getPlayerByName\': Player not found');
					res.status(400).send({ status: 'Error', message: 'Player not found'});
				}
			}
			else {
				log.info('Request \'getPlayerByName\' was successfully executed');
				res.status(200).send(result); 
			}
		});
	}
});

// get player by id
router.get('/:id', function(req, res, next) {
	const id = req.param.id;
	if (!validator.checkValue(id)) {
		log.debug('Request \'getPlayerById\': ID is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	}
	else {
		players.getPlayer(id, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'getPlayerById\': ID is invalid');
					res.status(400).send({ status: 'Error', message: 'Bad request: ID is invalid'});
				} 
				else { 
					log.debug('Request \'getPlayerById\': Player not found');
					res.status(400).send({ status: 'Error', message: 'Player not found'});
				}
			}
			else {
				log.info('Request \'getPlayerById\' was successfully executed');
				res.status(200).send(result); 
			}
		});
	}
});

/////////////////////////////////// PUT REQUEST ///////////////////////////////////
// generate test players
router.put('/test_generate', function (req, res, next) {
	let count = validator.checkInt(req.query.count);
	count = validator.checkValue(count) ? count : 10;
	for (let i = 0; i < count; i++){
		let player = new players({
			name  		: 'Player' + i.toString(),
			club  		: 'Club' + i.toString(),
			age			: Math.random(18, 45),
			rating    	: Math.random(45, 100)
		});
		
		players.createPlayer(player, function(err, result){
			err ? next(err) : log.debug('Save new player \'' + result.name + '\'');
		});
	}
	log.info('Random ' + count + ' players was created');
	res.status(200).send('Random ' + count + ' players was created');
});

// update player by id
router.put('/byname/:name', function(req, res, next) {
	const name = req.params.name;
	let clubTo = req.query.ClubTo;
	if (!validator.checkValue(name)) {
		log.debug('Request \'updatePlayerByName\': Name is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: Name is undefined'});
	}
	else if (!validator.checkValue(clubTo)) {
		log.debug('Request \'updatePlayerByName\': ClubTo is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: ClubTo is undefined'});
	}
	else {
		players.updatePlayer(name, clubTo, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'updatePlayerByName\': Name is invalid');
					res.status(400).send({ status: 'Error', message: 'Bad request: Name is invalid'});
				} 
				else { 
					log.debug('Request \'updatePlayerByName\': Player not found');
					res.status(400).send({ status: 'Error', message: 'Player not found'});
				}
			}
			else {
				log.info('Request \'updatePlayerByName\' was successfully executed');
				res.status(200).send(result.name + ' moved to ' + clubTo); 
			}
		});
	}
});

// update player by id
router.put('/:id', function(req, res, next) {
	const id = req.params.id;
	let clubTo = req.query.ClubTo;
	if (!validator.checkValue(id)) {
		log.debug('Request \'updatePlayerById\': ID is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	}
	else if (!validator.checkValue(clubTo)) {
		log.debug('Request \'updatePlayerById\': ClubTo is undefined');
		res.status(400).send({ status: 'Error', message: 'Bad request: ClubTo is undefined'});
	}
	else {
		players.updatePlayer(id, clubTo, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'updatePlayerById\': ID is invalid');
					res.status(400).send({ status: 'Error', message: 'Bad request: ID is invalid'});
				} 
				else { 
					log.debug('Request \'updatePlayerById\': Player not found');
					res.status(400).send({ status: 'Error', message: 'Player not found'});
				}
			}
			else {
				log.info('Request \'updatePlayerById\' was successfully executed');
				res.status(200).send(result.name + ' moved to ' + clubTo);
			} 
		});
	}
});

router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});