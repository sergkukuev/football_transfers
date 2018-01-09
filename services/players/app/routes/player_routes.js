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
			log.debug('Request \'getPlayers\': ' + err);
			res.status(400).send({ "message": err});
		}
		else {
			log.info('Request \'getPlayers\' was successfully executed');
			res.status(200).send(result);
		}
	});
});


// get player by id
router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	if (!validator.checkValue(id)) {
		log.debug('Request \'getPlayerById\': ID is undefined');
		res.status(400).send({ "message": "Bad request: ID is undefined"});
	}
	else {
		players.getPlayer(id, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'getPlayerById\': ID is invalid');
					res.status(400).send({ "message": "Bad request: ID is invalid"});
				} 
				else { 
					log.debug('Request \'getPlayerById\': Player not found');
					res.status(400).send({ "message": "Player not found"});
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
router.post('/test_generate', function (req, res, next) {
	let name = ["Roberto", "Sanches", "Morata", "Bakary", "Handanovich", "Messi", "Rivaldo", "Jo", "Lee", "Yamaho"];
	let club = ["Juventus", "Arsenal", "Barselona", "Betis", "Chelsea", "Milan", "Inter", "Bayern", "Koln", "CSKA"];
	let count = validator.checkInt(req.query.count);
	count = validator.checkValue(count) ? count : 10; 
	for (let i = 0; i < count; i++){
		let player = new players({
			name  		: name[i % 9],
			club  		: club[(i * 3) % 9],
			age			: (i*30 + 18) % (45 - 18) + 18,	//Math.random(18, 45),
			rating    	: (i*30 + 18) % (99 - 45) + 45,	//Math.random(45, 100)
			contract: {
				date: Date.now(),
				years: (i % 6) + 1
			}
		});
		players.createPlayer(player, function(err, result){
			err ? next(err) : log.debug('Save new player \'' + result.name + '\'');
		});
	}
	log.info('Random players was created');
	res.status(200).json({ "message": "Random players was created" });
});

// update contract player by id
router.put('/:id/contract/', function(req, res, next) {
	const id = req.params.id;
	let data = {
		date: validator.parseDate(req.body.StartDate), 
		years: parseInt(req.body.Years, 10)
	};
	if (!validator.checkValue(id)) {
		log.debug('Request \'updateContractById\': ID is undefined');
		res.status(400).send({ "message": "Bad request: ID is undefined"});
	}
	else if (!validator.checkValue(data.date)) {
		log.debug('Request \'updateContractById\': StartDate is undefined');
		res.status(400).send({ "message": "Bad request: StartDate is undefined"});
	}
	else if (!validator.checkValue(data.years)) {
		log.debug('Request \'updateContractById\': Years is undefined');
		res.status(400).send({ "message": "Bad request: Years is undefined"});
	}
	else {
		players.updateContract(id, data, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'updateContractById\': ID is invalid');
					res.status(400).send({ "message": "Bad request: ID is invalid"});
				} 
				else { 
					log.debug('Request \'updateContractById\': Player not found');
					res.status(400).send({ "message": "Player not found"});
				}
			}
			else {
				log.info('Request \'updateContractById\' was successfully executed');
				let msg = "Contract " + result.name + " was updated";
				res.status(200).send({ "message": msg });
			} 
		});
	}
});

// update player by id
router.put('/:id', function(req, res, next) {
	const id = req.params.id;
	let data = {
		clubTo: req.body.ClubTo,
		date: validator.parseDate(req.body.StartDate), 
		years: parseInt(req.body.Years, 10)
	};
	if (!validator.checkValue(id)) {
		log.debug('Request \'updatePlayerById\': ID is undefined');
		res.status(400).send({ "message": "Bad request: ID is undefined"});
	}
	else if (!validator.checkValue(data.date)) {
		log.debug('Request \'updatePlayerById\': StartDate is undefined');
		res.status(400).send({ "message": "Bad request: StartDate is undefined"});
	}
	else if (!validator.checkValue(data.clubTo)) {
		log.debug('Request \'updatePlayerById\': ClubTo is undefined');
		res.status(400).send({ "message": "Bad request: ClubTo is undefined"});
	}
	else if (!validator.checkValue(data.years)) {
		log.debug('Request \'updatePlayerById\': Years is undefined');
		res.status(400).send({ "message": "Bad request: Years is undefined"});
	}
	else {
		players.updatePlayer(id, data, function(err, result) {
			if (err) {
				if (err.kind == "ObjectID") {
					log.debug('Request \'updatePlayerById\': ID is invalid');
					res.status(400).send({ "message": "Bad request: ID is invalid"});
				} 
				else { 
					log.debug('Request \'updatePlayerById\': Player not found');
					res.status(400).send({ "message": "Player not found"});
				}
			}
			else {
				log.info('Request \'updatePlayerById\' was successfully executed');
				res.status(200).send({ "message": result.name + " moved to " + data.clubTo });
			} 
		});
	}
});

/////////////////////////////////// DELETE REQUEST ///////////////////////////////////
// delete all data
router.delete('/delete', function(req, res, next) {
	players.deletePlayers(function(err, result){
		if (err) {
			log.info("Request \'deletePlayers\':" + err);
			res.status(400).send({"message": err.message});
		}
		else {	
			log.info("Request \'deletePlayers\': Data was deleted");
			res.status(200).send({"message": "Data was deleted"});
		}
	});
});


router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});