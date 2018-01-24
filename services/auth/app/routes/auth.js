const   express   = require('express'),
        router    = express.Router(),
        validator = require('./../validators/login')
        passport  = require('./../passport');

module.exports = (app) => {
    app.use('/auth', router);
};

router.get('/authorization', function(req, res, next){
  res.render('auth', {
    response_type : req.query.response_type,
    redirect_uri  : req.query.redirect_uri,
    app_id        : req.query.app_id
  });
});

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
        const url = data.redirect_uri + "?code=" + encodeURIComponent(result);
        return res.redirect(302, url);
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
            } else if (type === 'password') {
                return passAuthorization(req, res, next, scope);
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

function passAuthorization(req, res, next, service_scope) {
    const data = {
        login: req.body.login, 
        pass: req.body.password
    };
    if (!data.login || !data.pass || typeof(data.login) == 'undefined' || typeof(data.pass) == 'undefined') {
        return res.status(400).send({status: 'Error', message: 'Bad request: login or password is undefined'});
    }
    return passport.setUserTokenByPass(data, function(err, status, user_scope) {
        if (err)
            return res.status(status).send({status: 'Error', message: err});
        if (!user_scope) {
            return res.status.send({status: 'Error', message: 'User for this login and password is not found'});
        }
        let item = {
            content: user_scope
        };

        if (service_scope !== true)
            item.service = service_scope;
        return res.status(200).send(item);
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


const mongoose = require('mongoose');
router.post('/user/create', function(req, res, next){
    let User = mongoose.model('User');
    let user = new User({
        login: req.body.login,
        password: req.body.password
    });

    User.create(user, function(err, result) {
        res.status(200).send(result);
    });
});

router.get('/access_tokens', function(req, res, next) {
    let model = require('./../models/tokens/users_access').model;
    //model.getByUserId('5a65b6e8df7e862bdcd7f03d', function(err, result) {
     //   return res.status(200).send(result);
    //});
    model.getAll(function(err, result) {
        return res.status(200).send(result);
    });
});

router.get('/users', function(req, res, next) {
    let model = require('./../models/user').model;
    model.getAll(function(err, result) {
        res.status(200).send(result);
    });
});

router.get('/refresh_tokens', function(req, res, next) {
    let model = require('./../models/tokens/refresh').model;
    model.getAll(function(err, result) {
        res.status(200).send(result);
    });
    /*model.remove(function(err, result){
        
    });*/
});