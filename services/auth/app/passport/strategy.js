const	crypto	= require('crypto'),
		config	= require('./../../config'),
		log 	= require('./../../config/log'),
		User   	= require('./../models/user').model,
		Client 	= require('./../models/client').model,
		AToken  = require('./../models/tokens/access').model,
		UAToken = require('./../models/tokens/users_access').model,
		RToken 	= require('./../models/tokens/refresh').model;

module.exports = {
	checkService : function(appId, appSecret, done) {
		return Client.findOne({appId : appId}, function(err, app_cli) {
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
	checkServiceById : function(appId, done) {
		return Client.findOne({appId: appId}, function (err, app_cli) {
			if (err)
				return done(err, 500);
			else if (!app_cli)
				return done('App not found', 404);
			return done(null, 200, true);
		});
	},
	getUserCode : function (login, password, done) {
		return User.findOne({login: login}, function (err, user) {
			if (err) {
				return done(err, 500, null);
			} else if (!user) {
				return done('User not found', 500, null);
			} else if (!user.checkPassword(password)) {
				return done('Password is wrong', 400, null);
			} else {
				User.updateCode(user.code, function (err, result) {
					console.log(result);
					if (err)
						return done(err, 500, null);
					else
						return done(null, 200, result.code);
				});
			}
		});
	},
	checkServiceAccessToken : function(accessToken, done) {
		return AToken.findOne({token : accessToken}, function(err, token) {
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
			return Client.findById(appId, function(err, application) {
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
		let token = new AToken({
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
	createTokenForUser : function(code, done) {
		return User.findOne({code: code}, function(err, user) {
			if (err)
				return done(err, 500);
			if (!user)
				return done('User with this code not found', 401, false);

			RToken.remove({userID: user.userID}, function(err) {
				if (err)
					return done(err);
				return;
			});
			UAToken.remove({userID : user.userID}, function(err) {
				if (err)
					return done(err);
				return;
			});

			let tokenValue = crypto.randomBytes(32).toString('base64');
			let refreshTokenValue = crypto.randomBytes(32).toString('base64');

			let token = new UAToken({
				token : tokenValue,
				userID: user.id
			});
			let refreshToken = new RToken({
				token : refreshTokenValue, 
				userID: user.id
			});

			return refreshToken.save(function(err) {
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
	createTokenForUserByPass : function(data, done) {
		return User.findOne({login: data.login}, function(err, user) {
			if (err)
				return done(err, 500);
			if (!user)
				return done('User with this login and password not found', 401, false);
			if (!user.checkPassword(data.pass))
				return done('Wrong password for this user', 400, false);

			RToken.remove({userID: user.userID}, function(err) {
				if (err)
					return done(err);
			});

			UAToken.remove({userID : user.userID}, function(err) {
				if (err)
					return done(err);
			});

			let tokenValue = crypto.randomBytes(32).toString('base64');

			let token = new UAToken({
				token : tokenValue,
				userID: user.id
			});

			return token.save(function(err, token) {
				if (err) {
					return done(err, 500);
				} else if (!token) {
						return done('Token was not saved', 500, false);
				} else {
					let result = {
						user: user,
						access_token: token,
						expires_in: config.security.userTokenLife
					}
					return done(null, null, result);
				}
			});
		});
	},
	createTokenForUserByToken : function(refreshToken, done) {
		RToken.findOne({token : refreshToken}, function(err, token) {
			if (err)
				return done(err, 500);
			if (!token)
				return done('Refresh token not found', 404, false);
			
			User.findById(token.userID, function(err, user) {
				if (err)
					return done(err, 500);
				if (!user)
					return done('User by this refresh token not found', 404, false);

				RToken.remove({userID : user.userID}, function(err) {
					if (err)
						return done(err, 500);
				});

				UAToken.remove({userID : user.userID}, function(err) {
					if (err)
						return done(err, 500);
				});

				let tokenValue = crypto.randomBytes(32).toString('base64');
				let refreshTokenValue = crypto.randomBytes(32).toString('base64');	
				
				let token = new UAToken({
					token : tokenValue, 
					userID: user.userID 
				});
	
				let refToken = new RToken({
					token : refreshTokenValue, 
					userID: user.userID
				});

				refToken.save(function(err) {
					if (err)
	    				return done(err, 500);
				});

				return token.save(function(err, token) {
					if (err) {
						return done(err, 500);
					} else if (!token) {
						return done('Token was not saved', 500, false);
					} else {
						let result = {
							access_token : tokenValue,
							refresh_token : refreshTokenValue,
							expires_in : config.security.userTokenLife
						}
						return done(null, null, result);
					}
				});
			});
		});
	},
	checkUserByAccessToken : function(accessToken, done) {
		UAToken.findOne({token : accessToken},function(err, token) {
			if (err)
				return done(err, 500);
			if (!token) {
				return done('Access token not found', 401, false);
			}

			const timeLife = Math.round((Date.now() - token.created) / 1000);
			if(timeLife > config.security.tokenLife) { 
				UAToken.remove({token : accessToken}, function(err) {
					if (err) 
						return done(err, 500);
				});
				return done('Token expired', 401);
			}
			return User.findById(token.userID, function(err, user) {	
				if (err)
					return done(err, 500);
				if (!user)
					return done('Unkown user', 401);
				return done(null, null, user);
			});
		});	
	}
}