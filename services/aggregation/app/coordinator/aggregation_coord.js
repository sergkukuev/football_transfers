const   PlayerHost 	= 'http://localhost:3001',
        ScoutHost	= 'http://localhost:3002',
        TransferHost	= 'http://localhost:3003';

module.exports = {
    // Players service
    getPlayers: function (page, count, callback) {
        const url = PlayerHost + '/players?page=' + page + '&count=' + count;
        const options = createOptions(url, 'GET');
        createAndSendGetHttpRequest(options, function (err, status, response) {
            return responseHandlerArrayObject(err, status, response, callback);
        });
        return;
    },
    getPlayer: function (id, callback) {
        const url = PlayerHost + '/players/' + id;
        const options = createOptions(url, "GET");
        createAndSendGetHttpRequest(options, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
        return;
    },
    getPlayerByName: function (name, callback) {
        const url = PlayerHost + '/players/byname/' + name;
        const options = createOptions(url, "GET");
        createAndSendGetHttpRequest(options, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
        return;
    },
    updatePlayer: function (id, clubTo, callback) {
        const url = PlayerHost + '/players/' + id + '?ClubTo=' + clubTo;
        const options = createOptions(url, "PUT");
        createAndSendHttpPutWithFormRequest(options, null, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
    },
    // Transfers service
    createTransfer: function (object, callback) {
        const url = TransferHost + '/transfers/create';
        const options = createOptions(url, "POST");
        createAndSendHttpPostRequest(options, object, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
        return;
    },
    updateTransfer: function (id, data, callback) {
        const url = TransferHost + '/transfers/update/' + id;
        const options = createOptions(url, "PUT");
        createAndSendHttpPutWithFormRequest(options, data, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
        return;
    },
    getTransfer: function (id, callback) {
        const url = TransferHost + '/transfers/' + id;
        const options = createOptions(url, "GET");
        createAndSendGetHttpRequest(options, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
        return;
    },
    getTransfers: function (page, count, callback) {
        const url = TransferHost + '/transfers?page=' + page + '&count=' + count;
        const options = createOptions(url, "GET");
        createAndSendGetHttpRequest(options, function (err, status, response) {
            return responseHandlerArrayObject(err, status, response, callback);
        });
        return;
    },
    // Scouts service
    getScouts: function (page, count, callback) {
        const url = ScoutHost + '/scouts?page=' + page + '&count=' + count;
        const options = createOptions(url, 'GET');
        createAndSendGetHttpRequest(options, function (err, status, response) {
            return responseHandlerArrayObject(err, status, response, callback);
        });
        return;
    },
    getScout: function (id, callback) {
        const url = ScoutHost + '/scouts/' + id;
        const options = createOptions(url, "GET");
        createAndSendGetHttpRequest(options, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
        return;
    },
    getScoutByName: function (name, callback) {
        const url = ScoutHost + '/scouts/byname/' + name;
        const options = createOptions(url, "GET");
        createAndSendGetHttpRequest(options, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
        return;
    },
    updateScout: function (id, callback) {
        const url = ScoutHost + '/scouts/' + id;
        const options = createOptions(url, "PUT");
        createAndSendHttpPutWithFormRequest(options, null, function (err, status, response) {
            return responseHandlerObject(err, status, response, callback);
        });
    }
}

function createAndSendHttpPutWithFormRequest(options, data, callback) {
    const request = require('request');
    request.put(options.uri, options, function (errors, response, body) {
        if (errors) {
            callback(errors, null, null);
        } else {
            callback(null, response.statusCode, body);
        }
    }).form(data);
}

function createAndSendHttpPostRequest(options, data, callback) {
    const request = require('request');
    request.post(options.uri, options, function (errors, response, body) {
        if (errors) {
            callback(errors, null, null);
        } else {
            callback(null, response.statusCode, body);
        }
    }).form(data);
}

function createAndSendGetHttpRequest(options, callback) {
    const request = require('request');
    request.get(options.uri, options, function (errors, response, body) {
        if (errors) {
            callback(errors, null, null);
        } else {
            callback(null, response.statusCode, body);
        }
    });
}

function createOptions(uri, method) {
    let item = {
        method: method,
        uri: uri,
    };
    return item;
}

function responseHandlerObject(err, status, response, callback) {
    if (err)
        return callback(err, status, response);
    else {
        if (response) {
            const object = JSON.parse(response);
            return callback(err, status, response);
        } else {
            return callback(err, status, null);
        }
    }
}

function responseHandlerArrayObject(err, status, response, callback) {
    if (err)
        return callback(err, status, response);
    else {
        if (status == 200) {
            if (response) {
                const parseObject = JSON.parse(response);
                const array = Array.from(parseObject);
                return callback(err, status, array);
            } else {
                return callback(err, status, null);
            }
        } else {
            if (response){
                return callback(null, status, JSON.parse(response));
            } else {
                return callback(null, status, null);
            }
        }
    }
}