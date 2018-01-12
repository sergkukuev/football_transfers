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
var interval1 = 500, interval2 = 2000; //20s

function addToQueue(name, func, data) {
	rabbitMQ.connect('amqp://guest:guest@localhost:5672', function(err, conn) {
		conn.createChannel(function(err, ch) {
			ch.assertQueue(name, { durable: false });
			ch.sendToQueue(name, Buffer.from(JSON.stringify(data)), { persistent: true });
			log.info("Operation \'" + func + "\' push to queue [" + name +"]");
		});
		setTimeout(function() { conn.close() }, interval1);
	});
}

function receiveFromQueue(name, func, callback){
	rabbitMQ.connect('amqp://guest:guest@localhost:5672', function(err, conn){
		conn.createChannel(function(err, ch){
			ch.assertQueue(name, { durable: false });
			ch.consume(name, function(data) {
				let string = data.content.toString('utf-8');
				let result = JSON.parse(string);
				log.info("Operation \'" + func + "\' pop to queue [" + name +"]");
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
	/*coord.liveTransferService(function(trans_err, trans_code) {
		coord.liveScoutService(function(scout_err, scout_code) {
			coord.livePlayerService(function(player_err, player_code) {
				if (trans_code == 200 && scout_code == 200 && player_code == 200) {
					receiveFromQueue(function(data){
						if (data) {
							createTransfer(data);
						}
					});
				}
			});
		});
	});*/
	coord.livePlayerService(function(err, code) {
		if (code == 200) {
			receiveFromQueue("players", "updatePlayer", function(data){
				if (data)
					updatePlayer(data);
			});
		}
	});
	coord.liveScoutService(function(err, code) {
		if (code == 200) {
			receiveFromQueue("scouts", "confirmScoutDeals", function(data){
				if (data)
					confirmScoutDeals(data);
			});
		}
	});
	coord.liveTransferService(function(err, code) {
		if (code == 200) {
			receiveFromQueue("transfers", "createTransfer", function(data){
				if (data)
					createTransfer(data);
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
function getTransfer(transfer, player, scout) {
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
	return item;
}

function getTransferWithoutPlayer(transfer, insteadPlayer, scout) {
	let item = {
		"ID"	: transfer.ID,
		"Player" : insteadPlayer,
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
	return item;
}

function getTransferWithoutScout(transfer, player, insteadScout) {
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
		"Scout"	: insteadScout,
		"Cost"		: transfer.cost,
		"DateOfSign": transfer.dateOfSign,
		"Club"	: {
			"To"	: transfer.club.to,
			"From"	: transfer.club.from
		}
	};
	return item;
}

function getTransferWithoutBoth(transfer, insteadPlayer, insteadScout) {
	let item = {
		"ID"	: transfer.ID,
		"Player" : insteadPlayer,
		"Scout"	: insteadScout,
		"Cost"		: transfer.cost,
		"DateOfSign": transfer.dateOfSign,
		"Club"	: {
			"To"	: transfer.club.to,
			"From"	: transfer.club.from
		}
	};
	return item;
}

router.get('/transfers/:id', function(req, res, next) {
	coord.getTransfer(req.params.id, function(trans_err, trans_code, trans_res) {
		if (trans_err) {
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
			if (trans_code == 200) {
				let transfer = JSON.parse(trans_res);
				coord.getPlayer(transfer.playerID, function(player_err, player_code, player_res) {
					coord.getScout(transfer.scoutID, function(scout_err, scout_code, scout_res) {
						let player = JSON.parse(player_res);
						let scout = JSON.parse(scout_res);
						// Оба сервиса недоступны
						if (player_err && scout_err)	
							res.status(trans_code).send(transfer);
						// Недоступен сервис игроков
						else if (player_err && !scout_err) { 
							if (scout_code == 200) {
								let item = getTransferWithoutPlayer(transfer, transfer.playerID, scout); 
								res.status(trans_code).send(item);
							}
							else {
								let item = getTransferWithoutBoth(transfer, transfer.playerID, "Not Found");
								res.status(trans_code).send(item);
							}
						}
						// Недоступен сервис скаутов
						else if (!player_err && scout_err) {
							if (player_code == 200) {
								let item = getTransferWithoutScout(transfer, player, transfer.scoutID); 
								res.status(trans_code).send(item);
							}
							else {
								let item = getTransferWithoutBoth(transfer, "Not Found", transfer.scoutID); 
								res.status(trans_code).send(item);
							}
						}
						// Все сервисы доступны
						else {
							if (player_code == 200 && scout_code == 200) {
								let item = getTransfer(transfer, player, scout);
								res.status(trans_code).send(item);
							}
							else if (player_code != 200) {
								let item  = getTransferWithoutPlayer(transfer, "Not Found", scout);
								res.status(trans_code).send(item);
							}
							else if (scout_code != 200) {
								let item = getTransferWithoutScout(transfer, player, "Not Found");
								res.status(trans_code).send(item);
							}
							else {
								let item = getTransferWithoutBoth(transfer, "Not Found", "Not Found");
								res.status(trans_code).send(item);
							}
						}
					});
				});
			}
			else
				res.status(trans_code).send(trans_res);
		}
	});
});


/////////////////////////////////// POST REQUEST ///////////////////////////////////
// create transfer (класть операцию в очередь)
router.post('/transfers/create', function(req, res, next) {
	const data = {
		playerID 	: req.body.playerID,
		scoutID 	: req.body.scoutID,
		cost 		: req.body.cost,
		date 		: req.body.date,
		clubTo 		: req.body.clubTo,
		years 		: req.body.years,
		clubFrom	: undefined
	};

	/*coord.liveTransferService(function(trans_err, trans_code) {
		coord.liveScoutService(function(scout_err, scout_code) {
			coord.livePlayerService(function(player_err, player_code) {
				if (trans_code != 200 || scout_code != 200 || player_code != 200) {
					addToQueue(data);
					res.status(202).send({status: "Accepted", message: "Operation \'createTransfer\' accepted for processing"});
				}
			});
		});
	});*/

	let player_data = {
		clubTo 	: data.clubTo,
		date 	: data.date,
		years 	: data.years
	};

	coord.updatePlayer(data.playerID, player_data, function(player_err, player_code, player_res) {
		if (player_err) { 
			addToQueue("players", "updatePlayer", data);
			res.status(202).send({status: "Accepted", message: "Operation \'updatePlayer\' accepted for processing"});
			//return next(player_err);
		}
		else {
			if (player_code == 200) {
				let player = JSON.parse(player_res);
				data.clubFrom = player.club;
				coord.incScoutDeals(data.scoutID, function(scout_err, scout_code, scout_res) {
					if (scout_err) {
						addToQueue("scouts", "confirmScoutDeals", data);
						res.status(202).send({status: "Accepted", message: "Operation \'confirmScoutDeals\' accepted for processing"});
						//return next (scout_err);
					}
					else {
						if (scout_code == 200) {
							coord.createTransfer(data, function(trans_err, trans_code, trans_res) {
								if (trans_err) {
									addToQueue("transfers", "createTransfer", data);
									res.status(202).send({status: "Accepted", message: "Operation \'createTransfer\' accepted for processing"});
									//return next(trans_err);
								}
								else
									res.status(trans_code).send(trans_res);
							});
						}
						else
							res.status(scout_code).send(scout_res);
					}
				});
			}
			else
				res.status(player_code).send(player_res);
		}
	});
});

function updatePlayer(data) {
	let player_data = {
		clubTo 	: data.clubTo,
		date 	: data.date,
		years 	: data.years
	};
	coord.updatePlayer(data.playerID, player_data, function(player_err, player_code, player_res) {
		if (player_err)
			addToQueue("players", "updatePlayer", data);
		else {
			if (player_code == 200) {
				let player = JSON.parse(player_res);
				data.clubFrom = player.club;
				coord.incScoutDeals(data.scoutID, function(scout_err, scout_code, scout_res) {
					if (scout_err)
						addToQueue("scouts", "confirmScoutDeals", data);
					else {
						if (scout_code == 200) {
							coord.createTransfer(data, function(trans_err, trans_code, trans_res) {
								if (trans_err)
									addToQueue("transfers", "createTransfer", data);
								else
									log.debug("Status: " + trans_code + "\nResult: " + trans_res);
							});
						}
						else
							log.debug("Status: " + scout_code + "\nResult: " + scout_res);
					}
				});
			}
			else
				log.debug("Status: " + player_code + "\nResult: " + player_res);
		}
	});
}

function confirmScoutDeals(data) {
	coord.incScoutDeals(data.scoutID, function(scout_err, scout_code, scout_res) {
		if (scout_err)
			addToQueue("scouts", "confirmScoutDeals", data);
		else {
			if (scout_code == 200) {
				coord.createTransfer(data, function(trans_err, trans_code, trans_res) {
					if (trans_err)
						addToQueue("transfers", "createTransfer", data);
					else
						log.debug("Status: " + trans_code + "\nResult: " + trans_res);
				});
			}
			else
				log.debug("Status: " + scout_code + "\nResult: " + scout_res);
		}
	});
}

function createTransfer(data){
	coord.createTransfer(data, function(trans_err, trans_code, trans_res) {
		if (trans_err)
			addToQueue("transfers", "createTransfer", data);
		else
			log.debug("Status: " + trans_code + "\nResult: " + trans_res);
	});
}

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
	coord.incScoutContracts(req.body.scoutID, function(err, code, result) {
		if (err) {
			res.status(503).send({ status: "Error", message: "Scout service unavailable", action: "Rollback operation"});
			//return next (err);
		}
		else {
			if (result) {
				coord.updatePlayerContract(req.params.id, data, function(player_err, player_code, player_res) {
					if (player_err) {
						coord.decScoutContracts(req.body.scoutID, function(scout_err, scout_code, scout_res) {
							if (err)
								return next(err);
							else
								res.status(503).send({ status: "Error", message: "Player service unavailable", action: "Rollback operation" });
						});
					}
					else {
						if (player_code == 200)
							res.status(player_code).send({status: "Ok", message: "Contract player \'" + req.params.id + "\' was updated"});
						else
							res.status(player_code).send(player_res);
					}
				});
			}
			else
				res.status(code).send(result);
		}
	});
});