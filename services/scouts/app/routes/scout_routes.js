var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	log = require('./../../libs/log')(module),
	scouts = mongoose.model('Scout'),
	validator = require('./../validators');

module.exports = function(app) {
	app.use('/api/scouts', router);
};

router.head('/live', function(req, res, next) {
	res.status(200).send({ status: "Ok", message: "I'm a live"});
});

/////////////////////////////////// GET REQUEST ///////////////////////////////////

// get all scouts
router.get('/', function(req, res, next) {
	let page = validator.checkInt(req.query.page);
	let count = validator.checkInt(req.query.count);
	page = validator.checkValue(page) ? page : 0;
	count = validator.checkValue(count) ? count : 0;
	scouts.getAll(page, count, function(err, result) {
		if (err) {
			log.error('Request \'getAll\': ' + err);
			res.status(400).send({ status: "Error", message: err});
		}
		else {
			log.info('Request \'getAll\': completed');
			res.status(200).send(result);
		}
	});
});

// get scout by id
router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	scouts.getById(id, function(err, result) {
		if (err) {
			if (err.kind == "ObjectId") {
				log.error('Request \'getById\': Incorrect ID');
				res.status(400).send({ status: "Error", message: "Incorrect ID"});
			} 
			else { 
				log.error('Request \'getById\': ' + err);
				res.status(400).send({ status: "Error", message: err});
			}
		}
		else {
			if (result) {
				log.info('Request \'getById\': completed');
				res.status(200).send(result); 
			}
			else {
				log.error('Request \'getById\': Scout not found');
				res.status(404).send({ status: "Error", message: "Scout not found"});	
			}
		}
	});
});

/////////////////////////////////// POST REQUEST ///////////////////////////////////
// generate test scouts
router.post('/test_generate', function (req, res, next) {
	let name = ["Carlito", "Sanches", "Paul", "Bakary", "Irvin", "Ops", "Albo", "Joshua", "King", "Yamaho"];
	let count = validator.checkInt(req.query.count);
	count = validator.checkValue(count) ? count : 10;
	for (let i = 0; i < count; i++){
		let scout = new scouts({
			name	: name[(i * 2) % 10],
			amount	: {
				deals: (i * 35) % 100,
				contracts: (i * 24) % 100 
			}
		});
		
		scouts.createScout(scout, function(err, result){
			err ? next(err) : log.debug('Save new scout \'' + result.name + '\'');
		});
	}
	log.info('Random scouts was created');
	res.status(200).send({ status: "Created", message: "Random scouts was created" });
});

/////////////////////////////////// PUT REQUEST ///////////////////////////////////
// increment deals scout by id
router.put('/:id/deals/confirm', function(req, res, next) {
	const id = req.params.id;
	scouts.getById(id, function(err, scout) {
		if (err) {
			log.error('Request \'confirmDeals\': ' + err);
			res.status(400).send({ status: "Error", message: err});
		}
		else {
			let data = {
				deal: scout.amount.deals + 1,
				contract: scout.amount.contracts
			};
			scouts.updateById(id, data, function(err, result) {
				if (err) {
					if (err.kind == "ObjectId") {
						log.error('Request \'confirmDeals\': Incorrect ID');
						res.status(400).send({ status: "Error", message: "Incorrect ID"});
					} 
					else { 
						log.error('Request \'confirmDeals\': ' + err);
						res.status(400).send({ status: "Error", message: err});
					}
				}
				else {
					if (result) {
						log.info('Request \'confirmDeals\': completed');
						let msg = "Deal was confirmed by a " + result.name;
						res.status(200).send(/*{ status: "Ok", message: msg }*/result);
					}
					else {
						log.error('Request \'confirmDeals\': Scout not found');
						res.status(404).send({ status: "Error", message: "Scout not found" });	
					}
				} 
			});
		}
	});
});

// decrement deals scout by id
router.put('/:id/deals/cancel', function(req, res, next) {
	const id = req.params.id;
	scouts.getById(id, function(err, scout) {
		if (err) {
			log.error('Request \'cancelDeals\': ' + err);
			res.status(400).send({ status: "Error", message: err});
		}
		else {
			let data = {
				deal: scout.amount.deals - 1,
				contract: scout.amount.contracts
			};
			scouts.updateById(id, data, function(err, result) {
				if (err) {
					if (err.kind == "ObjectId") {
						log.error('Request \'cancelDeals\': Incorrect ID');
						res.status(400).send({ status: "Error", message: "Incorrect ID"});
					} 
					else { 
						log.error('Request \'cancelDeals\': ' + err);
						res.status(400).send({ status: "Error", message: err});
					}
				}
				else {
					if (result) {
						log.info('Request \'cancelDeals\': completed');
						let msg = "Deal was canceled by a " + result.name;
						res.status(200).send(/*{ status: "Ok", message: msg });*/result);
					}
					else {
						log.error('Request \'cancelDeals\': Scout not found');
						res.status(404).send({ status: "Error", message: "Scout not found" });	
					}
				} 
			});
		}
	});
});

// increment contracts scout by id
router.put('/:id/contracts/confirm', function(req, res, next) {
	const id = req.params.id;
	scouts.getById(id, function(err, scout) {
		if (err) {
			log.error('Request \'confirmContract\': ' + err);
			res.status(400).send({ status: "Error", message: err});
		}
		else {
			let data = {
				deal: scout.amount.deals,
				contract: scout.amount.contracts + 1
			};
			scouts.updateById(id, data, function(err, result) {
				if (err) {
					if (err.kind == "ObjectId") {
						log.error('Request \'confirmContract\': Incorrect ID');
						res.status(400).send({ status: "Error", message: "Incorrect ID"});
					} 
					else { 
						log.error('Request \'confirmContract\': ' + err);
						res.status(400).send({ status: "Error", message: err});
					}
				}
				else {
					if (result) {
						log.info('Request \'confirmContract\': completed');
						let msg = "Contract was confirm by a " + result.name;
						res.status(200).send(/*{ status: "Ok", message: msg }*/result);
					}
					else {
						log.error('Request \'confirmContract\': Scout not found');
						res.status(404).send({ status: "Error", message: "Scout not found" });	
					}
				} 
			});
		}
	});
});

// increment contracts scout by id
router.put('/:id/contracts/cancel', function(req, res, next) {
	const id = req.params.id;
	scouts.getById(id, function(err, scout) {
		if (err) {
			log.error('Request \'cancelContract\': ' + err);
			res.status(400).send({ status: "Error", message: err});
		}
		else {
			let data = {
				deal: scout.amount.deals,
				contract: scout.amount.contracts - 1
			};
			scouts.updateById(id, data, function(err, result) {
				if (err) {
					if (err.kind == "ObjectId") {
						log.error('Request \'cancelContract\': Incorrect ID');
						res.status(400).send({ status: "Error", message: "Incorrect ID"});
					} 
					else { 
						log.error('Request \'cancelContract\': ' + err);
						res.status(400).send({ status: "Error", message: err});
					}
				}
				else {
					if (result) {
						log.info('Request \'cancelContract\': completed');
						let msg = "Contract was canceled by a " + result.name;
						res.status(200).send(/*{ status: "Ok", message: msg });*/result);
					}
					else {
						log.error('Request \'cancelContract\': Scout not found');
						res.status(404).send({ status: "Error", message: "Scout not found" });	
					}
				} 
			});
		}
	});
});


/////////////////////////////////// DELETE REQUEST ///////////////////////////////////
// delete all data
router.delete('/', function(req, res, next) {
	scouts.delete(function(err, result){
		if (err) {
			log.info("Request \'deleteScouts\':" + err);
			res.status(400).send({status: "Error", message: err.message});
		}
		else {	
			log.info("Request \'deleteScouts\': All data was deleted");
			res.status(200).send({status: "Ok", message: "All data was deleted"});
		}
	});
});
