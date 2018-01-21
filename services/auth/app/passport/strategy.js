const	crypto	= require('crypto'),
		config	= require('./../../config'),
		log 	= require('./../../config/log'),
		UserModel   	= require('./../models/user').userModel,
		ClientModel 	= require('./../models/client').clientModel,
		AccessToken  	= require('./../models/tokens/access').tokenModel,
		RefreshToken 	= require('./../models/tokens/refresh').tokenModel;

module.exports = {
	checkService : function(appId, appSecret, done) {
		return ClientModel.findOne({appId : appId}, function(err, app_cli) {
			if (err) {
				return done(err, 500);
			} else if (!app_cli) {
				return done('Application with this appId and appSecret not found', 401, false);
			} else if (app_cli.appSecret != appSecret) {
				return done('Application with this appId and appSecret not found', 401, false);
			} else
				return done(null, null, app_cli);
		});
	},
	checkServiceAccessToken : function(accessToken, done) {
		return AccessToken.findOne({token : accessToken}, function(err, token) {
			if (err) {
				return done(err, 500);
			} else if (!token) {
				return done('Application with this access token not found', 401, false);
			}

			const timeLife = (Date.now() - token.created) / 1000;
			if (timeLife > config.security.serviceTokenLife) {
				token.remove(function(err) {
					if (err)
						return done(err, 500, false);
				});
				return done('Access token is expired', 401, false);
			}
			const appId = token.userID;
			return ClientModel.findById(appId, function(err, application) {
				if (err) { 
					return done(err, 500, false);
				} else if (!application) {
					return done('Wrong access token', 404, false);
				} else
					return done(null, null, true);
			});
		});
	},
	setNewAccessToken : function(application, done) {
		let tokenValue = crypto.randomBytes(32).toString('base64');
		let token = new AccessToken({
			userID	: application.id,
			token 	: tokenValue
		});
		return token.save(function(err, token) {
			if (err) {
				return done(err, 500, null);
			} else if (!token) {
				return done('Token not saved', 500, null);
			} else {
				let result = {
					token : tokenValue,
					expires_in : config.security.serviceTokenLife
				};
				return done(null, null, result);
			}
		});
	},
	createTokenForUser : function(login, password, done) {
		return UserModel.findOne({login: login}, function(err, user) {
			if (err)
				return done(err, 500);
			if (!user)
				return done('User with this login or password not found', 400, false);
			if (!user.checkPassword(password))
				return done('Wrong password', 401, false);

			RefreshToken.remove({userID: user.userID}, function(err) {
				if (err)
					return done(err);
				return;
			});

			AccessToken.remove({userID : user.userID}, function(err) {
				if (err)
					return done(err);
				return;
			});

			let tokenValue = crypto.randomBytes(32).toString('base64');
			let refreshTokenValue = crypto.randomBytes(32).toString('base64');

			let token = new AccessToken({
				token : tokenValue,
				userID: user.id
			});
			let refreshToken = new RefreshToken({
			token : refreshTokenValue, 
			userID: user.id
			});

			refreshToken.save(function(err) {
				if (err)
					return done(err, 500);
				token.save(function(err, token) {
					if (err)
						return done(err, 500);
					else {
						let result = {
							user: user,
							access_token: tokenValue,
							refresh_token: refreshTokenValue,
							expires_in: config.security.userTokenLife
						}
						return done(null, null, result);
					}
				});
			});
		});
	},
	createTokenForUserByToken : function(refreshToken, done) {
		RefreshToken.findOne({token : refreshToken}, function(err, token) {
			if (err)
				return done(err, 500);
			if (!token)
				return done('Refresh token not found', 404, false);
			
			UserModel.findById(token.userID, function(err, user) {
				if (err)
					return done(err, 500);
				if (!user)
					return done('User by this refresh token not found', 404, false);

				RefreshToken.remove({userID : user.userID}, function(err) {
					if (err)
						return done(err, 500);
				});
				AccessToken.remove({userID : user.userID}, function(err) {
					if (err)
						return done(err, 500);
				});

				let tokenValue = crypto.randomBytes(32).toString('base64');
				let refreshTokenValue = crypto.randomBytes(32).toString('base64');	
				
				let token = new AccessToken({
					token : tokenValue, 
					userID: user.userID 
				});
	
				let refToken = new RefreshToken({
					token : refreshTokenValue, 
					userID: user.userID
				});

				refToken.save(function(err) {
					if (err)
	    				return done(err, 500);
				});

				return token.save(function(err, token) {
					if (err)
						return done(err, 500);
					if (!token)
						return done('Token was not saved', 500, false);
	
					let result = {
						access_token : tokenValue,
						refresh_token : refreshTokenValue,
						expires_in : config.security.userTokenLife
					}
					return done(null, null, result);
				});
			});
		});
	},
	checkUserByAccessToken : function(accessToken, done) {
		AccessToken.findOne({token : accessToken},function(err, token) {
			if (err)
				return done(err, 500);
			if (!token)
				return done('Access token not found', 401, false);

			const timeLife = Math.round((Date.now() - token.created) / 1000);
			if(timeLife > config.security.tokenLife) { 
				AccessToken.remove({token : accessToken}, function(err) {
					if (err) 
						return done(err, 500);
				});
				return done('Token expired', 401);
			}
			return UserModel.findById(token.userID, function(err, user) {	
				if (err)
					return done(err, 500);
				if (!user)
					return done('Unkown user', 401);
				return done(null, null, user);
			});
		});	
	}
}