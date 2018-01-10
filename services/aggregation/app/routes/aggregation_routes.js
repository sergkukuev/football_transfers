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

// get player by id
router.get('/players/:id', function(req, res, next) {
	coord.getPlayer(req.params.id, function(err, statusCode, player) {
		if (err) {
			log.debug(err);
			return next(err);
		}
		else {
			log.info("Player was received");
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
			log.info("Scouts was received");
			res.status(statusCode).send(scouts);
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
			log.info("Scout was received");
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
			log.info("Transfers was received");
			res.status(statusCode).send(transfers);
		}
	});
});

// get transfer by id
router.get('/transfers/:id', function(req, res, next) {
	coord.getTransfer(req.params.id, function(err, statusCode, result) {
		if (err)
			return next(err);
		else {
			if (statusCode == 200) {
				let transfer = JSON.parse(result);
				coord.getPlayer(transfer.playerID, function(err2, statusCode2, result2) {
					if (err2)
						return next(err2);
					else {
						if (statusCode2 == 200) {
							let player = JSON.parse(result2);
							coord.getScout(transfer.scoutID, function(err3, statusCode3, result3) {
								if (err3)
									return next(err3);
								else {
									if (statusCode3 == 200) {
										let scout = JSON.parse(result3);
										let item = {
											"Player" : {
												"Name"		: player.name,
												"Club"		: player.club,
												"Age"		: player.age,
												"Rating"	: player.rating,
												"Contract"	: {
													"StartDate"	: player.contract.date,
													"Years"		: player.contract.years
												}
											},
											"Scout"	: {
												"Name"		: scout.name,
												"Deals"		: scout.amount.deals,
												"Contracts"	: scout.amount.contracts,
												"Rank"		: scout.rank
											},
											"Cost"		: transfer.cost,
											"DateOfSign": transfer.dateOfSign,
											"Club"	: {
												"To"	: transfer.club.to,
												"From"	: transfer.club.from
											}
										};
										res.status(200).send(item);
									}
									else
										res.status(statusCode3).send(result3);
								}
							});
						}
						else
							res.status(statusCode2).send(result2);
					}
				});
			}
			else
				res.status(statusCode).send(result);
		}
	});
});

/////////////////////////////////// POST REQUEST ///////////////////////////////////
// create transfer
router.post('/transfers/create', function(req, res, next) {
	const param = {
		PlayerID 	: req.body.PlayerID,
		ScoutID 	: req.body.ScoutID,
		Cost 		: req.body.Cost,
		DateOfSign 	: req.body.DateOfSign,
		ClubTo 		: req.body.ClubTo, 
		ClubFrom	: undefined,
		ContractYears: req.body.ContractYears
	};

	coord.getPlayer(param.PlayerID, function(err, statusCode, result) {
		if (err)
			return next(err);
		else {
			if (statusCode == 200) {
				let player = JSON.parse(result);
				param.ClubFrom = player.club;
				coord.updateScoutDeals(param.ScoutID, function(err1, statusCode1, result1) {
					if (err1)
						return next (err1);
					else {
						if (statusCode1 == 200) {
							coord.createTransfer(param, function(err2, statusCode2, result2) {
								if (err2)
									return next(err2);
								else {
									if (statusCode2 == 200) {
										coord.updatePlayer(param.PlayerID, player_param, function(err3, statusCode3, result3) {
											if (err3)
												return next(err3);
											else {
												if (statusCode3 == 200)
													res.status(statusCode2).send(result2);
												else
													res.status(statusCode3).send(result3);
											}
										});
									}
									else
										res.status(statusCode2).send(result2);			
								}
							});
							let player_param = {
								ClubTo 		: param.ClubTo,
								StartDate 	: param.DateOfSign,
								Years 		: param.ContractYears
							};
						}
						else
							res.status(statusCode1).send(result1);
					}
				});
			}
			else
				res.status(statusCode).send(result);
		}
	});
});

/////////////////////////////////// PUT REQUEST ///////////////////////////////////
// update transfer info
/*router.put('/transfers/update/:id', function(req, res, next) {
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
});*/

// update contract info
router.put('/players/contract/', function(req, res, next) {
	const data = {
		StartDate: req.body.StartDate,
		Years: req.body.Years
	};

	coord.updatePlayerContract(req.body.PlayerID, data, function(err, statusCode, result) {
		if (err)
			return next(err);
		else {
			if (statusCode == 200) {	
				coord.updateScoutContracts(req.body.ScoutID, function(err1, statusCode1, result1) {
					if (err1)
						return next(err1);
					else {
						if (statusCode1 != 200)
							res.status(statusCode1).send(result1);
						else
							res.status(statusCode).send(result);
					}
				});
			}
			else
				res.status(statusCode).send(result);
		}
	});
});