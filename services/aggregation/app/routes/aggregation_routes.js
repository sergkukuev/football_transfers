var express	= require('express'),
	router 	= express.Router(),
	log = require('./../../libs/log')(module),
	coord	= require('./../coordinator/aggregation_coord'),
	validator	= require('./../validators');

module.exports = function(app) {
	app.use('/', router);
};

/////////////////////////////////// GET REQUEST ///////////////////////////////////
// get all players
router.get('/players', function(req, res, next) {
	const page = validator.checkInt(req.query.page);
	const count = validator.checkInt(req.query.count);
	coord.getPlayers(page, count, function(err, statusCode, players) {
		if (err) {
			log.debug(err);
			return next(err);
		}
		else {
			log.info('Players was received');
			res.status(statusCode).send(players);
		}
	});
});

// get player by name
router.get('/players/byname/:name', function(req, res, next) {
	coord.getPlayerByName(req.params.name, function(err, statusCode, player) {
		if (err) {
			log.debug(err);
			return next(err);
		}
		else {
			log.info('Player was received');
			res.status(statusCode).send(player);
		}
	});
});

// get player by id
router.get('/players/:id', function(req, res, next) {
	coord.getPlayer(req.params.id, function(err, statusCode, player) {
		if (err) {
			log.debug(err);
			return next(err);
		}
		else {
			log.info('Player was received');
			res.status(statusCode).send(player);
		}
	});
});

// get all scouts
router.get('/scouts', function(req, res, next) {
	const page = validator.checkInt(req.query.page);
	const count = validator.checkInt(req.query.count);
	coord.getScouts(page, count, function(err, statusCode, scouts) {
		if (err) {
			log.debug(err);
			return next(err);
		}
		else {
			log.info('Scouts was received');
			res.status(statusCode).send(scouts);
		}
	});
});

// get scout by name
router.get('/scouts/byname', function(req, res, next) {
	coord.getScoutByName(req.params.name, function(err, statusCode, scout) {
		if (err) {
			log.debug(err);
			return next(err);
		}
		else {
			log.info('Scout was received');
			res.status(statusCode).send(scout);
		}
	});
});

// get scout by id
router.get('/scouts/:id', function(req, res, next) {
	coord.getScout(req.params.id, function(err, statusCode, scout) {
		if (err) {
			log.debug(err);
			return next(err);
		}
		else {
			log.info('Scout was received');
			res.status(statusCode).send(scout);
		}
	});
});

// get transfers
router.get('/transfers', function(req, res, next) {
	const page = validator.checkInt(req.query.page);
	const count = validator.checkInt(req.query.count);
	coord.getTransfers(page, count, function(err, statusCode, transfers) {
		if (err){
			log.debug(err);
			next(err);
		}
		else {
			log.info('Transfers was received');
			res.status(statusCode).send(transfers);
		}
	});
});

// get transfer by id
router.get('/transfers/:id', function(req, res, next) {
	coord.getTransfer(req.params.id, function(err, statusCode, transfer) {
		if (err)
			next(err);
		else {
			let trans = JSON.parse(transfer);
			coord.getPlayer(trans.PlayerID, function(err2, statusCode2, player) {
				if (err2)
					next(err2);
				else {
					coord.getScout(trans.ScoutID, function(err3, statusCode3, scout) {
						let play = JSON.parse(player);
						let sc = JSON.parse(scout);
						if (err3)
							next(err3);
						else {
							let result = {
								Player: {
									'Name'	: player.Name,
									'Club'	: play.Club,
									'Age'	: play.Age,
									'Rating': play.Rating
								},
								Scout:{
									'Name'	: sc.Name,
									'AmountOfDeals': sc.AmountOfDeals,
									'Rank'	: sc.Rank
								},
								Cost: trans.Cost,
								DateOfSign: trans.DateOfSign,
								ClubTo: trans.ClubTo
							};
							res.status(statusCode3).send(result);
						}
					});
				}
			});
		}
	});
});

/////////////////////////////////// POST REQUEST ///////////////////////////////////
// create transfer
router.post('/transfers/create', function(req, res, next) {
	const param = {
		PlayerID: req.body.PlayerID,
		ScoutID: req.body.ScoutID,
		Cost: req.body.Cost,
		DateOfSign: req.body.DateOfSign,
		ClubTo: req.body.ClubTo
	};

	coord.updateScout(param.ScoutID, function(err, statusCode, result) {
		if (err)
			next(err);
		else
			log.debug(result);
	});
	coord.updatePlayer(param.PlayerID, param.ClubTo, function(err, statusCode, result) {
		if (err)
			next(err);
		else
			log.debug(result);
	});
	coord.createTransfer(param, function(err, statusCode, transfer) {
		if (err)
			return next(err);
		else {
			log.info('Transfer created')
			res.status(statusCode).send(transfer);
		}
	});
});

/////////////////////////////////// PUT REQUEST ///////////////////////////////////
// update transfer info
router.put('/transfers/update/:id', function(req, res, next) {
	const id = req.params.id;
	const param = {
		Cost: req.body.Cost,
		DateOfSign: req.body.DateOfSign,
		ClubTo: req.body.ClubTo
	};
	coord.getTransfer(id, function(err, status, transfer) {
		let arr = JSON.parse(transfer);
		coord.updatePlayer(arr.PlayerID, param.ClubTo, function(err, statusCode, result) {
			if (err)
				next(err);
			else
				log.debug(result);
		});
	});
	coord.updateTransfer(id, param, function(err, statusCode, transfer) {
		if (err)
			return next(err);
		else {
			log.info('Transfer updated')
			res.status(statusCode).send(transfer);
		}
	});
});