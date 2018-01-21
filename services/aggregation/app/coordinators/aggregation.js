const   PlayerHost 	  = 'http://localhost:3001/api',
        ScoutHost	  = 'http://localhost:3002/api',
        TransferHost  = 'http://localhost:3003/api',
        AuthHost      = 'http://localhost:3005';

const config = require('./../../libs/config'),
        log  = require('./../../libs/log');

module.exports = {
    // Auth service
     getTokenByPassword : function(info, callback) {
        let main_function = function(info, callback) {
            const url = _AuthHost + '/auth/token';
            const options = createOptions(url, 'POST', AuthToken);
            const data = {
                grant_type  : 'password',
                login       : info.login,
                password    : info.password
            };
            return createAndSendHttpPostRequest(options, data, function(err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromAuth(status, response, main_function, info, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                });
            });
        }
        return main_function(info, callback);
    },
    getTokenByToken : function(info, callback) {
        let main_function = function(info, callback) {
            const url = _AuthHost + '/auth/token';
            const options = createOptions(url, 'POST', AuthToken);
            const data = {
                grant_type  : 'refresh_token',
                refresh_token : info.ref_token
            };
            return createAndSendHttpPostRequest(options, data, function(err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromAuth(status, response, main_function, info, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                });                
            });
        }
        return main_function(info, callback);
    },
    getUserInfo : function(info, callback) {
        let main_function = function(info, callback) {
            const url = _AuthHost + '/auth/userId';
            const options = createOptions(url, 'GET', AuthToken, info.token);
            return createAndSendGetHttpRequest(options, function(err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    let repeat = checkServicesInformationFromAuth(status, response, main_function, info, callback);
                    if (!repeat)
                        callback(err, status, response);
                    return;
                });
            });
        }
        return main_function(info, callback);
    },
    // Players service
    getPlayers: function (data, callback) {
        let main_function = function(data, callback) {
            const url = PlayerHost + '/players?page=' + data.page + '&count=' + data.count;
            const options = createOptions(url, 'GET');
            createAndSendGetHttpRequest(options, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromPlayer(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    getPlayer: function (data, callback) {
        let main_function = function(data, callback) {
            const url = PlayerHost + '/players/' + data.id;
            const options = createOptions(url, "GET");
            createAndSendGetHttpRequest(options, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromPlayer(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    updatePlayerContract: function (dataContainer, callback) {
        let main_function = function(data, callback) {
            const url = PlayerHost + '/players/' + dataContainer.id + '/contract/';
            const options = createOptions(url, "PUT");
            createAndSendHttpPutWithFormRequest(options, dataContainer.data, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromPlayer(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(dataContainer, callback);
    },
    updatePlayer: function (dataContainer, callback) {
        let main_function = function(data, callback) {
            const url = PlayerHost + '/players/' + dataContainer.id;
            const options = createOptions(url, "PUT");
            createAndSendHttpPutWithFormRequest(options, dataContainer.data, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromPlayer(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(dataContainer, callback);
    },
    // Scouts service
    getScouts: function (data, callback) {
        let main_function = function(data, callback) {
            const url = ScoutHost + '/scouts?page=' + data.page + '&count=' + data.count;
            const options = createOptions(url, 'GET');
            createAndSendGetHttpRequest(options, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromScout(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    getScout: function (data, callback) {
        let main_function = function(data, callback) {
            const url = ScoutHost + '/scouts/' + data.id;
            const options = createOptions(url, "GET");
            createAndSendGetHttpRequest(options, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromScout(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    incScoutDeals: function (data, callback) {
        let main_function = function(data, callback) {
            const url = ScoutHost + '/scouts/' + data.id + '/deals/confirm';
            const options = createOptions(url, "PUT");
            createAndSendHttpPutWithFormRequest(options, null, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromScout(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    decScoutDeals: function (data, callback) {
        let main_function = function(data, callback) {
            const url = ScoutHost + '/scouts/' + data.id + '/deals/cancel';
            const options = createOptions(url, "PUT");
            createAndSendHttpPutWithFormRequest(options, null, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromScout(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    incScoutContracts: function (data, callback) {
        let main_function = function(data, callback) {
            const url = ScoutHost + '/scouts/' + data.id + '/contracts/confirm';
            const options = createOptions(url, "PUT");
            createAndSendHttpPutWithFormRequest(options, null, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromScout(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    decScoutContracts: function (data, callback) {
        let main_function = function(data, callback) {
            const url = ScoutHost + '/scouts/' + data.id + '/contracts/cancel';
            const options = createOptions(url, "PUT");
            createAndSendHttpPutWithFormRequest(options, null, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromScout(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    // Transfers service
    createTransfer: function (data, callback) {
        let main_function = function(data, callback) {
            const url = TransferHost + '/transfers/create';
            const options = createOptions(url, "POST");
            createAndSendHttpPostRequest(options, data.object, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromTransfer(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    getTransfer: function (data, callback) {
        let main_function = function(data, callback) {
            const url = TransferHost + '/transfers/' + data.id;
            const options = createOptions(url, "GET");
            createAndSendGetHttpRequest(options, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromTransfer(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },
    getTransfers: function (data, callback) {
        let main_function = function(data, callback) {
            const url = TransferHost + '/transfers?page=' + data.page + '&count=' + data.count;
            const options = createOptions(url, "GET");
            createAndSendGetHttpRequest(options, function (err, status, response) {
                return responseHandlerObject(err, status, response, function(err, status, response) {
                    const repeat = checkServicesInformationFromTransfer(status, response, main_function, data, callback);
                    if (!repeat)
                        return callback(err, status, response);
                    return;
                }); 
            });
        }
        return main_function(data, callback);
    },

    // livecheck services
    livePlayerService: function(callback) {
        const url = PlayerHost + '/players/live';
        const options = createOptions(url, 'HEAD');
        createAndSendHeadHttpRequest(options, function(err, status) {
            return callback(err, status);
        });
        return;
    },
    liveScoutService: function(callback) {
        const url = ScoutHost + '/scouts/live';
        const options = createOptions(url, 'HEAD');
        createAndSendHeadHttpRequest(options, function(err, status) {
            return callback(err, status);
        });
        return;
    },
    liveTransferService: function(callback) {
        const url = TransferHost + '/transfers/live';
        const options = createOptions(url, 'HEAD');
        createAndSendHeadHttpRequest(options, function(err, status) {
            return callback(err, status);
        });
        return;
    }
}

var AuthToken = null,
    PlayerToken = null,
    ScoutToken = null, 
    TransferToken = null;

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

function createAndSendHeadHttpRequest(options, callback) {
    const request = require('request');
    request.head(options.uri, options, function(errors, response, body) {
        if (errors) {
            return callback(errors, null, null);
        } else {
            return callback(null, response.statusCode, body);
        }
    });
}

function createAndSendDeleteHttpRequest(options, callback) {
    const request = require('request');
    request.delete(options.uri, options, function (errors, response, body) {
        if (errors) {
            callback(errors, null, null);
        } else {
            callback(null, response.statusCode, body);
        }
    });
}

function createOptions(uri, method, token, user_token = null, user_id = null) {
    let item = {
        method: method,
        uri: uri,
    };
    if (token) {
        item.auth = {
            bearer: token.token
        }
    } else {
        item.auth ={
            user: config.app.id,
            pass: config.app.secret
        }
    }
    item.headers = {};
    if (user_token)
        item.headers['user-authorization'] = 'Bearer ' + user_token;
    if (user_id)
        item.headers['userId'] = user_id;
    return item;
}

function responseHandlerObject(err, status, response, callback) {
    if (err) {
        if (err.code == "ECONNREFUSED")
            return callback(err, 503, 'Sorry. Service is not available, please try again later');
        else
            return callback(err, status, response);
    }
    else {
        if (response) {
            const object = JSON.parse(response);
            return callback(err, status, response);
        } else {
            return callback(err, status, null);
        }
    }
}

function checkServicesInformationFromAuth(status, response, method, info, callback) {
    if (status == 401 && response.status == 'Service error') {
        log.info('Token AuthToken not topical');
        delete AuthToken;
        AuthToken = null;
        method(info, callback);
        return true;
    } else if (typeof(response.service) != 'undefined') {
        log.info('Set new AuthToken Token');
        AuthToken = response.service;
        delete response.service;
    }
    return false;
}

function checkServicesInformationFromPlayer(status, response, method, info, callback) {
    if (status == 401 && response.status == 'Service error') {
        log.info('Token Player not topical');
        delete PlayerToken;
        PlayerToken = null;
        method(info, callback);
        return true;
    } else if (typeof(response.service) != 'undefined') {
        log.info('Set new PlayerToken');
        PlayerToken = response.service;
        delete response.service;
    }
    return false;
}

function checkServicesInformationFromScout(status, response, method, info, callback) {
    if (status == 401 && response.status == 'Service error') {
        log.info('Token Scout not topical');
        delete ScoutToken;
        ScoutToken = null;
        method(info, callback);
        return true;
    } else if (typeof(response.service) != 'undefined') {
        log.info('Set new ScoutToken');
        ScoutToken = response.service;
        delete response.service;
    }
    return false;
}

function checkServicesInformationFromTransfer(status, response, method, info, callback) {
    if (status == 401 && response.status == 'Service error') {
        log.info('Token Trnasfer not topical');
        delete TransferToken;
        TransferToken = null;
        method(info, callback);
        return true;
    } 
    if (response && typeof(response.service) != 'undefined') {
        log.info('Set new TransferToken');
        TransferToken = response.service;
        delete response.service;
    }
    return false;
}