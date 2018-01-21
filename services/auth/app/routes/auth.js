const   express   = require('express'),
        router    = express.Router(),
        passport  = require('./../passport');

module.exports = (app) => {
    app.use('/auth', router);
};

router.post('/login', function(req, res, next){
    const data = {
        responseType  : validator.checkResponseType(req.body.response_type),
        appId         : validator.checkAvailability(req.body.app_id),
        redirect_uri  : validator.checkAvailability(req.body.redirect_uri),
        login         : req.body.login,
        password      : req.body.password
    };
    if (!data.appId || !data.redirect_uri || !data.responseType)
        return res.status(401).send({status : "Error", message : "One of parametrs is undefined"});
    if (!data.login || !data.password) {
        return res.status(401).render('auth',{
            response_type : data.responseType,
            redirect_uri : data.redirect_uri,
            app_id : data.appId
        });
    }
    return passport.getUserCode(data, function(err, status, result){
        if (err)
            return res.status(status).send(err);
        const fullUrl = data.redirect_uri + "?code=" + encodeURIComponent(result);
        return res.redirect(302, fullUrl);
    });
});

router.post('/token', function(req, res, next) {
    const header_auth = req.headers['authorization'];

    if (header_auth && typeof(header_auth) !== 'undefined') {
        return passport.checkServiceAuthorization(header_auth, function(err, status, scope) {
            if (err)
                return res.status(status).send({ status: 'Service error', message: err});
            if (!scope)
                return res.status(status).send({ status: 'Service error', message: 'Scope is undefined'});   
            let type = req.body.grant_type;
            if (type === 'authorization_code') {
                return codeAuthorization(req, res, next, scope);
            } else if (type === 'refresh_token') {
                return refreshTokenAuthorization(req, res, next, scope);
            } else {
                return res.status(400).send({ status: 'Error', message: 'Parametr "grant_type" is undefined'});
            }
        });
    } else
        return res.status(401).send({ status: 'Service error', message: 'Header "Authorization" is undefined'});
});

router.get('/userId', function(req, res, next) {
    const header_auth = req.headers['authorization'];

    if (header_auth && typeof(header_auth) !== 'undefined') {
        return passport.checkServiceAuthorization(header_auth, function(err, status, scope) {
            if (err)
                return res.status(status).send({ status: 'Service error', message: err});
            if (!scope)
                return res.status(status).send({ status: 'Service error', message: 'Scope is null'});
            const user_auth = req.headers['user-authorization'];
            if (user_auth && typeof(user_auth) !== 'undefined') {
                return passport.checkUserByBearer(user_auth, function(err, status, user) {
                    if (err)
                        return res.status(status).send({ status: 'Error', message: err});
                    if (!user)
                        return res.status(status).send({ status: 'Error', message: 'User is null'});
                    return res.status(200).send({id : user.id});
                });
            }
            return res.status(401).send({ status: 'Error', message: 'Header "user-authorization" is undefined'});
        });
    } else
        return res.status(401).send({ status: 'Service error', message: 'Header "Authorization" is undefined'});
});

function codeAuthorization(req, res, next, service_scope) {
    const code = req.body.code;
    if (!code || typeof(code) == 'undefined')
        return res.status(400).send({ status: 'Error', message: 'Bad request login or password is undefined'});
    return passport.setUserTokenByCode(code, function(err, status, user_scope) {
        if (err)
            return res.status(status).send({ status: 'Error', message: err});
        if (!user_scope)
            return res.status(status).send({ status: 'Error', message: 'User for this password and login is not found'});
        const data = { content : user_scope };
        if (service_scope !== true)
            data.service = service_scope;
        return res.status(200).send(data);
    });
}

function refreshTokenAuthorization(req, res, next, service_scope) {
    const token = req.body.refresh_token;
    if (!token || typeof(token) == 'undefined')
        return res.status(400).send({ status: 'Error', message: 'Token is undefined'});
    return passport.setUserTokenByToken(token, function(err, status, user_scope) {
        if (err)
            return res.status(status).send({ status: 'Error', message: err});
        if (!user_scope)
            return res.status(status).send({ status: 'Error', message: 'Scope is null'});
        const data = {content : user_scope};
        if (service_scope !== true)
            data.service = service_scope;
        return res.status(200).send(data);
    });
}

/*
const mongoose = require('mongoose');
router.get('/create', function(req, res, next){
    let model = mongoose.model('User');
    let user = new model({
        login: 'Valencia',
        password : '6666'
    });
    user.save(function(err, nw_user){
        if (err)
            return res.send(err);
        return res.send(nw_user);
    });
        
    let ClientModel = mongoose.model('Client');
    var client = new ClientModel({ name: "Valencia", appId: "es1", appSecret:"6666" });
    client.save(function(err, client) {
        if(err) 
            return res.send(err);
        res.send(null);
    });
});
*/