const crypto        = require('crypto'),
      life          = require('./../../config').app.tokenLife,
      AppManager    = require('./../models/app').model,
      TokenManager  = require('./../models/tokens/access').token;

module.exports = {
checkService : function(appId, appSecret, done) {
	return AppManager.findOne({appId : appId}, function(err, app_cli) {
		if (err)
			return done(err, 500);
		if (!app_cli)
			return done('Application with this appId and appSecret not found', 401);
		if (app_cli.appSecret != appSecret)
			return done('Application with this appId and appSecret not found', 401);
		return done(null, null, app_cli);
	});
},
    checkServiceAccessToken : function(accessToken, done) {
		return TokenManager.findOne({token : accessToken}, function(err, token) {
			if (err)
				return done(err, 500);
			if (!token)
				return done('Application with this access token not found', 401, false);
		
			const timeLife = (Date.now() - token.created) / 1000;
			if (timeLife > life) {
				return token.remove(function(err) {
					if (err)
                        return done(err, 500);
                    return done('Access token is expired', 401);
				});
			}
			const appId = token.appId;
			return AppManager.findById(appId, function(err, app) {
				if (err)
					return done(err, 500);
				if (!app)
					return done('Wrong access token', 404);
				return done(null, null, true);
			});
		});
	},
	setNewAccessTokenToApp : function(app, done) {
		let tokenValue = crypto.randomBytes(32).toString('base64');
		let token = new TokenManager({
			appId 	: app.id,
			token   : tokenValue
		});
		return token.save(function(err, token) {
			if (err)
				return done(err, 500, null);
			if (!token)
				return done('Token not saved', 500, null);
			const scope = {
				token : tokenValue,
				expires_in : life
			};
			return done(null, null, scope);
		});
	},
}