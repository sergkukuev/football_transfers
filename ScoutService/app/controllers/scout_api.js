var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	ScoutsSystem = mongoose.model('Scout');

module.exports = function(app) {
	app.use('/ScoutsSystem', router);
};

// Для функции getScouts
router.get('/', function(req, res, next) {
	let page;
	let count;
	// TODO: Сделать валидатор на page и count
	page = (typeof(page) != 'undefined') ? page : 0;
	count = (typeof(count) != 'undefined') ? count : 0;
	ScoutsSystem.getScouts(page, count, function(err, result) {
		err ? res.status(400).send({ status: 'Error', message: err}) :
			res.status(200).send(result);
	});
});

// Для фуннкции getScout
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

// Для функции getShortList
router.get('/:id', function(req, res, next) {
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

router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});