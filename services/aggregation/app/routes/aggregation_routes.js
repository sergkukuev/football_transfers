var express		= require('express'),
	router 		= express.Router(),
	log 		= require('./../../libs/log')(module),
	coord		= require('./../coordinator/aggregation_coord'),
	validator	= require('./../validators'), 
	rabbitMQ 	 = require('amqplib/callback_api');

module.exports = function(app) {
	app.use('/', router);
};

/////////////////////////////////// QUEVE ///////////////////////////////////
var interval1 = 500, interval2 = 1000;

function addToQueue(nameService, info) {
	rabbitMQ.connect('amqp://localhost', function(err, conn) {
		conn.createChannel(function(err, ch) {
			let name = 'services';
			let data = {
				service: nameService,
				param: info
			}
			ch.assertQueue(name, { durable: false });
			ch.sendToQueue(name, Buffer.from(data), { persistent: true });
			log.info("Operation service " + nameService + " push to queue [" + name +"]");
		});
		setTimeout(function() { conn.close() }, interval1);
	});
}

function reveiceFromQueue(callback){
	amqp.connect('amqp://localhost', function(err, conn){
		conn.createChannel(function(err, ch){
			var name = 'services';

			ch.assertQueue(name, { durable: false });
			ch.consume(name, function(data) {
				let string = data.content.toString('utf-8');
				let result = JSON.parse(string);
				log.info("Operation service " + data.service + " pop to queue [" + name +"]");
				callback(result);
			}, {noAck : true});
			setTimeout(function() { 
				conn.close();
				callback(null); 
			}, interval1);
		});
	});
}

// create transfers (queue)
setInterval(function(){
	coord.liveTransferService(function(err, status){
		if (status == 200){
			receiveFromQueue(function(data){
				if (data){
					coord.createTransfer(param, function(err2, statusCode2, result2) {
						if (err2)
							addToQueue("Transfers", data);
							//return next(err2);
						else {
							if (statusCode2 == 201)
								res.status(statusCode2).send(result2);
							else
								res.status(statusCode2).send(result2);			
						}
					});
				}
			});
		}
	});
}, interval2);

/////////////////////////////////// GET REQUEST ///////////////////////////////////
// get all players
router.get('/players', function(req, res, next) {
	const page = validator.checkInt(req.query.page);
	const count = validator.checkInt(req.query.count);
	coord.getPlayers(page, count, function(err, statusCode, players) {
		if (err) {
			log.error(err);
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
			log.error(err);
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
			log.error(err);
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
			log.error(err);
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
			log.error(err);
			next(err);
		}
		else {
			log.info("Transfers was received");
			res.status(statusCode).send(transfers);
		}
	});
});

// get transfer by id (деградация функциональности)
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
// create transfer (класть операцию в очередь)
router.post('/transfers/create', function(req, res, next) {
	const param = {
		playerID 	: req.body.playerID,
		scoutID 	: req.body.scoutID,
		cost 		: req.body.cost,
		date 		: req.body.date,
		clubTo 		: req.body.clubTo, 
		clubFrom	: undefined,
	};

	let player_param = {
		clubTo 	: param.clubTo,
		date 	: param.date,
		years 	: req.body.years
	};

	coord.updatePlayer(param.playerID, player_param, function(err, statusCode, result) {
		if (err3)
			return next(err3);
		else {
			if (statusCode == 200) {
				let player = JSON.parse(player);
				param.clubFrom = player.club;
				coord.incScoutDeals(param.scoutID, function(err1, statusCode1, result1) {
					if (err1)
						return next (err1);
					else {
						if (statusCode1 == 200) {
							coord.createTransfer(param, function(err2, statusCode2, result2) {
								if (err2)
									addToQueue("Transfers", data);
									//return next(err2);
								else {
									if (statusCode2 == 201)
										res.status(statusCode2).send(result2);
									else
										res.status(statusCode2).send(result2);			
								}
							});
						}
						else {
							res.status(statusCode1).send(result1);
						}
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
				log.error(result);
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

// update contract info (полный откат операции)
router.put('/players/:id/contract/', function(req, res, next) {
	const data = {
		date: req.body.date,
		years: req.body.years
	};
	coord.incScoutContracts(req.body.scoutID, function(err, statusCode, result) {
		if (err) {
			res.status(503).send({ status: "Error", message: "Scout service unavailable", action: "Rollback operation"});
			//return next (err);
		}
		else {
			coord.updatePlayerContract(req.params.id, data, function(err1, statusCode1, result1) {
				if (err1) {
					coord.decScoutContracts(req.body.scoutID, function(err2, statusCode2, result2) {
						if (err) {
							return next(err);
						}
						else {
							res.status(503).send({ status: "Error", message: "Player service unavailable", action: "Rollback operation" });
						}
					});
				}
				else {
					if (statusCode1 == 200) {
						res.status(statusCode1).send({status: "Ok", message: "Contract player \'" + req.params.id + "\' was updated"});
					}
					else {
						res.status(statusCode1).send(result1);
					}
				}
			});
		}
	});
});