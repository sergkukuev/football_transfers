const   express   = require('express'),
        router    = express.Router(),
        passport  = require('./../passport');

module.exports = (app) => {
    app.use('/auth', router);
};

router.post('/token', function(req, res, next) {
    const header_auth = req.headers['authorization'];

    if (header_auth && typeof(header_auth) !== 'undefined') {
        return passport.checkServiceAuthorization(header_auth, function(err, status, scope) {
            if (err)
                return res.status(status).send({ status: 'Service error', message: err});
            if (!scope)
                return res.status(status).send({ status: 'Service error', message: 'Scope is undefined'});   
            let type = req.body.grant_type;
            if (type === 'password') {
                return passwordAuthorization(req, res, next, scope);
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

function passwordAuthorization(req, res, next, service_scope) {
    const log = req.body.login;
    const pwd = req.body.password;
    if (!log || !pwd || typeof(log) == 'undefined' || typeof(pwd) == 'undefined')
        return res.status(400).send({ status: 'Error', message: 'Bad request login or password is undefined'});
    return passport.setUserTokenByPwd(log, pwd, function(err, status, user_scope) {
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
        return res.status(400).send({ status: 'Error', 'Token is undefined'));
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
