const   basic       = require('basic-auth'),
        strategy    = require('./strategy') ;

const basicType  = /basic/i;
const bearerType = /bearer/i;


module.exports = {
    checkServiceAuthorization : function(header_authorization, callback) {
        const type = basicType.test(header_authorization);
        if (type) {
            return checkBasicAuthorization(header_authorization, callback);
        } else if (bearerType.test(header_authorization)) {
            return checkBearerAuthorization(header_authorization, callback);
        }
        return callback('Unknown authorization type', 400, null);
    },
    /**
    * @param {Object} data - data
    */
    getUserCode : function (data, callback) {
        const validator = checkResponseType(data.responseType, 'code');
        if (!validator) {
            return callback('Invalid responseType', 400, null);
        }
        return strategy.checkServiceById(data.appId, function (err, status, response) {
            if (err) {
                return callback(err, status, response);
            } else if (!response) {
                return callback(err, status, null);
            } else
                return strategy.getUserCode(data.login, data.password, function(err, status, code){
                    return callback(err, status, code);
                });
        });
    },
    setUserTokenByCode : function(code, callback) {
        return strategy.createTokenForUser(code, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    },
    setUserTokenByPass : function(data, callback) {
        return strategy.createTokenForUserByPass(data, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    },
    setUserTokenByToken : function(token, callback) {
        return strategy.createTokenForUserByToken(token, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    },
    checkUserByBearer : function(header_text , callback) {
        if (!bearerType.test(header_text))
            return callback('Is not Bearer token', 400, null);
        const token = getBearer(header_text);
        return strategy.checkUserByAccessToken(token, function(err, status, user) {
            if (err)
                return callback(err, status);
            if (status || !user)
                return callback('User not found', status);
            return callback(null, status, user);
        });
    }   
}

function checkResponseType(type, needed) {
    if (type === needed)
        return true;
    return false;
}

function checkBasicAuthorization(header_authorization, callback) {
    const service = basic.parse(header_authorization);
    return strategy.checkService(service.name, service.pass, function(err, status, application) {
        if (err)
            return callback(err, status, null);
        if (!application)
            return callback(null, status, null);
        return strategy.setNewAccessToken(application, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    });
}

function checkBearerAuthorization(header_authorization, callback) {
    const serviceToken = getBearer(header_authorization);
    return strategy.checkServiceAccessToken(serviceToken, function(err, status, result) {
        if (err)
            return callback(err, status, null);
        return callback(null, status, result);
    });
}

function getBearer(token) {
    token = String(token);
    token = token.slice(7);
    return token;
}