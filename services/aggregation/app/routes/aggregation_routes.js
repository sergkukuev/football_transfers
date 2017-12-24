var express	= require('express'),
	router 	= express.Router(),
	coord	= require('./../coordinator/aggregation_coord'),
	valid	= require('./../validators/aggregation_validator');

module.exports = function(app) {
	app.use('/aggregator', router);
};

// get all players
router.get('/players', function(req, res, next) {
	const page = valid.checkPosIntNumber(req.query.page);
	const count = valid.checkPosIntNumber(req.query.count);
	coord.getPlayers(page, count, function(err, statusCode, resText) {
		err ? return next(err) : res.status(statusCode).send(resText);
	});
});

// get player by id
router.get('/players/:id', function(req, res, next) {
	const id = valid.checkID(req.params.id);
	if (typeof(id) == 'undefined')
		res.status(400).send({ status: 'Error', message: 'Bad request'});
	else {
		coord.getPlayer(id, function(err, statusCode, resText) {
			err ? return next(err) : res.status(statusCode).send(resText);
		});
	}
});

// get all scouts
router.get('/scouts', function(req, res, next) {
	const page;
	const count;
	coord.getScouts(page, count, function(err, statusCode, resText) {
		err ? return next(err) : res.status(statusCode).send(resText);
	});
});

// get scout by id
router.get('/scouts/:id', function(req, res, next) {
	const id;
	if (typeof(id) == 'undefined')
		res.status(400).send({ status: 'Error', message: 'Bad request'});
	else {
		coord.getScout(id, function(err, statusCode, resText) {
			err ? return next(err) : res.status(statusCode).send(resText);
		});
	}
});

// create transfer
router.post('/transfers/new_transfer', function(req, res, next) {
	const param = {
		PlayerID: req.body.PlayerID,
		ScoutID: req.body.ScoutID,
		startDate:req.body.startDate,
		endDate: req.body.endDate,
		Cost: req.body.Cost
	};
	coord.createTransfer(param, function(err, statusCode, res) {
		err ? return next(err) : res.status(statusCode).send(res);
	});
});