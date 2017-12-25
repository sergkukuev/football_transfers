var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	ScoutSystem = mongoose.model('Scout'),
	validator = require('./../validators/scout_validator');

module.exports = function(app) {
	app.use('/scouts', router);
};

// get all scouts
router.get('/', function(req, res, next) {
	let page = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page = (typeof(page) != 'undefined') ? page : 0;
	count = (typeof(count) != 'undefined') ? count : 0;
	ScoutSystem.getScouts(page, count, function(err, result) {
		err ? res.status(400).send({ status: 'Error', message: err}) :
			res.status(200).send(result);
	});
});

// get scout by id
router.get('/:id', function(req, res, next) {
	const id = '5a40096005d0dd2d18c6167e';
	//const id = req.params.id;
	if (!id || typeof(id) == 'undefined' || id.length == 0)
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	else {
		ScoutSystem.getScout(id, function(err, result) {
			if (err) {
				err.kind == "ObjectID" ? 
					res.status(400).send({ status: 'Error', message: 'Bad request: Invalid ID'}) : 
					res.status(400).send({ status: 'Error', message: 'Scout not found'});
			}
			else
				res.status(200).send(result); 
		});
	}
});

// update scout by id
router.put('/:id', function(req, res, next) {
	const id = '5a40096005d0dd2d18c6167e';	// and this
	//const id = req.params.id;
	if (!id || typeof(id) == 'undefined' || id.length == 0)
		res.status(400).send({ status: 'Error', message: 'Bad request: ID is undefined'});
	else {
		ScoutSystem.updateScout(id, function(err, result) {
			if (err) {
				err.kind == "ObjectID" ? 
					res.status(400).send({ status: 'Error', message: 'Bad request: ID is invalid'}) : 
					res.status(400).send({ status: 'Error', message: 'Scout not found'});
			}
			else
				res.status(200).send(result + ' updated'); 
		});
	}
});

router.options('/live', function(req, res, next) {
	res.status(200).send(null);
});

// generate tests scouts
router.put('/test_generate', function (req, res, next) {
	const count = req.query.count ? req.query.count : 20;
	for (let i = 1; i < count + 1; i++){
		let scout = new ScoutSystem({
			name  			: 'Scout ' + i.toString(),
			amountOfDeals	: (i * 43) % 100,
		});
		
		ScoutSystem.createScout(scout, function(err, result){
			err ? next(err) : log.info("Save new scout " + i.toString());
		});
	}
	res.status(200).send('Random ' + count + ' scouts');
});