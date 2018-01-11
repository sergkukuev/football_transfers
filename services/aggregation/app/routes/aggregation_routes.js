var express		= require('express'),
	router 		= express.Router(),
	log 		= require('./../../libs/log')(module),
	coord		= require('./../coordinator/aggregation_coord'),
	validator	= require('./../validators');//, 
	//rabbitMQ 	= require('amqplib/callback_api');

module.exports = function(app) {
	app.use('/', router);
};

/////////////////////////////////// QUEVE ///////////////////////////////////

/*setInterval(function() {
	coord.liveTransferService(function(err, status) {
		if (status == 200) {
			receiveFromQueve(function(id) {
				if (id) {
					coord.
				}
			});
		}
	});
});*/

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
// Для этого запроса выполнять деградацию функциональности
router.get('/transfers/:id', function(req, res, next) {
	coord.getTransfer(req.params.id, function(err, statusCode, result) {
		if (err) {
			let item = {
				"ID"		: req.params.id,
				"PlayerID" 	: 'undefined',
				"ScoutID" 	:'undefined',
				"Cost"		: 'undefined',
				"DateOfSign": 'undefined',
				"Club"	: {
					"To"	: 'undefined',
					"From"	: 'undefined'
				}
			};
			res.status(500).send(item);
		}
		else {
			if (statusCode == 200) {
				let transfer = JSON.parse(result);
				coord.getPlayer(transfer.playerID, function(err2, statusCode2, result2) {
					coord.getScout(transfer.scoutID, function(err3, statusCode3, result3) {
						let player = JSON.parse(result2);
						let scout = JSON.parse(result3);
						// Оба сервиса недоступны
						if (err2 && err3)	
							res.status(statusCode).send(transfer);
						// Недоступен сервис игроков
						else if (err2 && !err3) { 
							if (statusCode3 == 200) {
								let item = {
									"ID"	: transfer.ID,
									"PlayerID" : transfer.playerID,
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
								res.status(statusCode).send(item);
							}
							else {
								let item = {
									"ID"	: transfer.ID,
									"PlayerID" : transfer.playerID,
									"Scout"	: "Not Found",
									"Cost"		: transfer.cost,
									"DateOfSign": transfer.dateOfSign,
									"Club"	: {
										"To"	: transfer.club.to,
										"From"	: transfer.club.from
									}
								};
								res.status(statusCode).send(item);
							}
						}
						// Недоступен сервис скаутов
						else if (!err2 && err3) {
							if (statusCode2 == 200) {
								let item = {
									"ID"	: transfer.ID,
									"Player": {
										"Name"		: player.name,
										"Club"		: player.club,
										"Age"		: player.age,
										"Rating"	: player.rating,
										"Contract"	: {
											"StartDate"	: player.contract.date,
											"Years"		: player.contract.years
										}
									},
									"ScoutID"	: transfer.scoutID,  
									"Cost"		: transfer.cost,
									"DateOfSign": transfer.dateOfSign,
									"Club"	: {
										"To"	: transfer.club.to,
										"From"	: transfer.club.from
									}
								};
								res.status(statusCode).send(item);
							}
							else {
								let item = {
									"ID"		: transfer.ID,
									"PlayerID" 	: "Not Found",
									"ScoutID"	: transfer.scoutID,
									"Cost"		: transfer.cost,
									"DateOfSign": transfer.dateOfSign,
									"Club"	: {
										"To"	: transfer.club.to,
										"From"	: transfer.club.from
									}
								};
								res.status(statusCode).send(item);
							}
						}
						// Все сервисы доступны
						else {
							if (statusCode2 == 200 && statusCode3 == 200) {
								let item = {
									"ID"	: transfer.ID,
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
								res.status(statusCode).send(item);
							}
							else if (statusCode2 != 200) {
								let item = {
									"ID"	: transfer.ID,
									"Player" :"Not Found",
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
								res.status(statusCode).send(item);
							}
							else if (statusCode3 != 200) {
								let item = {
									"ID"	: transfer.ID,
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
									"Scout"	: "Not Found",
									"Cost"		: transfer.cost,
									"DateOfSign": transfer.dateOfSign,
									"Club"	: {
										"To"	: transfer.club.to,
										"From"	: transfer.club.from
									}
								};
								res.status(statusCode).send(item);
							}
							else {
								let item = {
									"ID"	: transfer.ID,
									"Player" : "Not Found",
									"Scout"	: "Not Found",
									"Cost"		: transfer.cost,
									"DateOfSign": transfer.dateOfSign,
									"Club"	: {
										"To"	: transfer.club.to,
										"From"	: transfer.club.from
									}
								};
								res.status(statusCode).send(item);
							}
						}
					});
				});
			}
			else
				res.status(statusCode).send(result);
		}
	});
});

/////////////////////////////////// POST REQUEST ///////////////////////////////////
// create transfer
// Класть операции в очередь на выполнение
router.post('/transfers/create', function(req, res, next) {
	const param = {
		playerID 	: req.body.playerID,
		scoutID 	: req.body.scoutID,
		cost 		: req.body.cost,
		date 		: req.body.date,
		clubTo 		: req.body.clubTo, 
		clubFrom	: undefined,
	};

	coord.getPlayer(param.playerID, function(err, statusCode, result) {
		if (err)
			return next(err);
		else {
			if (statusCode == 200) {
				let player = JSON.parse(result);
				param.clubFrom = player.club;
				coord.incScoutDeals(param.scoutID, function(err1, statusCode1, result1) {
					if (err1)
						return next (err1);
					else {
						if (statusCode1 == 200) {
							coord.createTransfer(param, function(err2, statusCode2, result2) {
								if (err2)
									return next(err2);
								else {
									if (statusCode2 == 201) {
										let player_param = {
											clubTo 	: param.clubTo,
											date 	: param.date,
											years 	: req.body.years
										};
										coord.updatePlayer(param.playerID, player_param, function(err3, statusCode3, result3) {
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
// Выполнить полный откат операции
router.put('/players/contract/', function(req, res, next) {
	const data = {
		date: req.body.date,
		years: req.body.years
	};

	coord.updatePlayerContract(req.body.playerID, data, function(err, statusCode, result) {
		if (err)
			return next(err);
		else {
			if (statusCode == 200) {	
				coord.incScoutContracts(req.body.scoutID, function(err1, statusCode1, result1) {
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