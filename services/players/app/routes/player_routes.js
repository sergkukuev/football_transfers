var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	PlayerSystem = mongoose.model('Player'),
	validator = require('./../validator/player_validator');

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
router.get('/:id', function(req, req, next) {
	const id = req.params.id;
	if (!id || typeof(id) == 'undefined' || id.length == 0)
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	else {
		PlayerSystem.getPlayer(id, function(err, result) {
			err ? (err.kind == "ObjectID" ? res.status(400).send({ status: 'Error', message: 'Bad request: Invalid ID'}) : 
					res.status(400).send({ status: 'Error', message: 'Player not found'})) :
				res.status(200).send(result); 
		});
	}
});

router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});