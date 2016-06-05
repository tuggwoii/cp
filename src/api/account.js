'use strict';
var Authorize = require('../authorize/auth');
var BaseApi = require('./base');
var User = require('../database/models').User;
var Role = require('../database/models').Role;
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);
var FB = require('fb'),
    fb = new FB.Facebook({version: 'v2.6'});
	
class AccountApi extends BaseApi {

    registerModel (data) {
        return {
            email: data.email,
            password: bcrypt.hashSync(data.password, salt),
            name: data.name,
            user_role: 1
        };
    }

    loginSerializer (data) {
        if (!data.id) {
            if (data['null']) {
                data['id'] = data['null'];
            }
            else {
                data['id'] = 0;
            }
        }
        var json = JSON.stringify(data);
        var model = JSON.parse(json);
        return model;
    }

    comparePassword (password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    findByEmail (email) {
        var promise = new Promise(function (resolve, reject) {
            User.findAll({
                where: { email: email },
                include: [
                    { model: Role }
                ]
            }).then(function (users) {
                resolve(users);
           }).catch(function (err) {
               reject(err);
           });
        });
        return promise;
    }

    validateLogin (data) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            if (!data.email) {
                reject({ message: 'EMAIL REQUIRED' });
            }
            else if (!data.password) {
                reject({ message: 'PASSWORD REQUIRED' });
            }
            else {
                me.findByEmail(data.email).then(function (users) {
                    if (users.length) {
                        var user = users[0].dataValues;
                        if (me.comparePassword(data.password, user.password)) {
                            resolve(user);
                        }
                        else {
                            reject({ message: 'INVALID' });
                        }
                    }
                    else {
                        reject({ message: 'INVALID' });
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
        return promise;
    }

    validateRegister (data) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            if (!data.email) {
                reject({ message: 'EMAIL REQUIRED' });
            }
            else if (!data.password) {
                reject({ message: 'PASSWORD REQUIRED' });
            }
            else {
                me.findByEmail(data.email).then(function (users) {
                    if (users.length) {
                        reject({ message: 'EMAIL EXIST' });
                    }
                    else {
                        resolve();
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
        return promise;
    }

    getAll (context, req, res) {
        User.all().then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    validateUpdate(data) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            if (!data.email) {
                reject({ message: 'EMAIL REQUIRED' });
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    update (context, req, res) {
        var user = req.body;
        User.findById(user.id).then(function (_user) {
            if (_user) {
                if (user.password) {
                    user.password = bcrypt.hashSync(user.password);
                }
                context.validateUpdate(user).then(function () {
                    _user.updateAttributes(user).then(function (data) {
                        context.success(req, res, data);
                    }).catch(function () {
                        context.error(req, res, err, 500);
                    });
                }).catch(function (err) {
                    context.error(req, res, err, 400);
                });
            }
            else {
                context.error(req, res, 'NOT FOUND', 404);
            }
        }).catch(function (err) {
            responseError(req, res, err, 500);
        });
    }

    login (context, req, res) {
		res.send(req.body);
		/*
		if(req.body && req.body.fb_token) {
			 
		}
		else {
			context.validateLogin(req.body).then(function (_user) {
            var user = context.loginSerializer(_user);
            Authorize.authorizeUser(user).then(function (auth_user) {
                context.success(req, res, auth_user);
				}).catch(function (err) {
					context.error(req, res, err, 500);
				});
			}).catch(function (err) {
				context.error(req, res, err, 400);
			});
		}*/
    }

    register (context, req, res) {
        var data = req.body;
        context.validateRegister(data).then(function () {
            var user = context.registerModel(data);
            User.create(user, { isNewRecord: true }).then(function (model) {
                context.success(req, res, model);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }).catch(function (err) {
            context.error(req, res, err, 400);
        });
    }

    logout (context, req, res) {
        var user = req.user;
        if (user && user.email) {
            Authorize.removeUser(user).then(function () {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.error(req, res, {message:'SESSION NOT FOUND'}, 500);
        }
    }

    me (context, req, res) {
        context.success(req, res, req.user);
    }

    endpoints () {
        return [
            { url: '/accounts', method: 'get', roles: ['admin'], response: this.getAll },
			{ url: '/accounts/login', method: 'post', roles: [], response: this.login },
            { url: '/accounts', method: 'post', roles: [], response: this.register },
            { url: '/accounts', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/accounts/me', method: 'get', roles: ['admin', 'user'], response: this.me },
            { url: '/accounts/logout', method: 'post', roles: ['admin', 'user'], response: this.logout }
        ];
    }
}

module.exports = new AccountApi();
