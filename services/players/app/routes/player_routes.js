var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	PlayerSystem = mongoose.model('Player'),
	validator = require('./../validators/player_validator');

module.exports = function(app) {
	app.use('/players', router);
};

// get all players
router.get('/', function(req, res, next) {
	let page = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page = (typeof(page) != 'undefined') ? page : 0;
	count = (typeof(count) != 'undefined') ? count : 0;
	PlayerSystem.getPlayers(page, count, function(err, result) {
		err ? res.status(400).send({ status: 'Error', message: err}) :
			res.status(200).send(result);
	});
});

// get player by id
router.get('/:id', function(req, res, next) {
	const id = '5a3fb1000824f917acdb7f06'; // fixed this
	//const id = req.param.id;
	if (!id || typeof(id) == 'undefined' || id.length == 0)
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	else {
		PlayerSystem.getPlayer(id, function(err, result) {
			if (err) {
				err.kind == "ObjectID" ? 
					res.status(400).send({ status: 'Error', message: 'Bad request: ID is invalid'}) : 
					res.status(400).send({ status: 'Error', message: 'Player not found'});
			}
			else
				res.status(200).send(result); 
		});
	}
});

// update player
router.put('/:id', function(req, res, next) {
	const id = '5a3fb1000824f917acdb7f06';	// and this
	//const id = req.params.id;
	let clubTo = req.query.ClubTo;
	if (!id || typeof(id) == 'undefined' || id.length == 0)
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	else if (!clubTo || typeof(clubTo) == 'undefined' || clubTo.length == 0)
		res.status(400).send({ status: 'Error', message: 'Bad request: ClubTo is undefined'});
	else {
		PlayerSystem.updatePlayer(id, clubTo, function(err, result) {
			if (err) {
				err.kind == "ObjectID" ? 
					res.status(400).send({ status: 'Error', message: 'Bad request: ID is invalid'}) : 
					res.status(400).send({ status: 'Error', message: 'Player not found'});
			}
			else
				res.status(200).send(result + ' moved to ' + clubTo); 
		});
	}
});

router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});

// generate test players
router.put('/test_generate', function (req, res, next) {
	const count = validator.checkInt(req.query.count);
	count = (typeof(count) != 'undefined') ? count : 20;
	for (let i = 0; i < count; i++){
		let player = new PlayerSystem({
			name  		: 'Player ' + i.toString(),
			club  		: 'Club ' + i.toString(),
			age			: (100 - i) % (45 - 18) + 18,
			rank    	: (90 * i) % 100
		});
		
		PlayerSystem.createPlayer(player, function(err, result){
			err ? next(err) : log.info("Save new player " + i.toString());
		});
	}
	res.status(200).send('Random ' + count + ' players');
});