var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	ScoutsSystem = mongoose.model('Scout'),
	validator = require('./../validator/scout_validator');

module.exports = function(app) {
	app.use('/scouts', router);
};

// get all scouts
router.get('/', function(req, res, next) {
	let page = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page = (typeof(page) != 'undefined') ? page : 0;
	count = (typeof(count) != 'undefined') ? count : 0;
	ScoutsSystem.getScouts(page, count, function(err, result) {
		err ? res.status(400).send({ status: 'Error', message: err}) :
			res.status(200).send(result);
	});
});

// get scout by id
router.get('/:id', function(req, req, next) {
	const id = req.params.id;
	if (!id || typeof(id) == 'undefined' || id.length == 0)
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	else {
		ScoutsSystem.getScout(id, function(err, result) {
			err ? (err.kind == "ObjectID" ? res.status(400).send({ status: 'Error', message: 'Bad request: Invalid ID'}) : 
					res.status(400).send({ status: 'Error', message: 'Scout not found'})) :
				res.status(200).send(result); 
		});
	}
});

// get players list for scout by id
/*router.get('/players/:id', function(req, res, next) {
	const id = req.params.id;
	if (!id == typeof(id) == 'undefined' || id.length == 0)
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	else {
		ScoutsSystem.getShortList(id, function(err, result) {
			err ? (err.kind == "ObjectID" ? res.status(400).send({ status: 'Error', message: 'Bad request: Invalid ID'}) : 
					res.status(400).send({ status: 'Error', message: 'Scout not found'})) :
				res.status(200).send(result);
		});
	}
});
*/
router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});