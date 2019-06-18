var bcrypt = require('bcryptjs');
var userModel = require('../models/users.model');
var verifier = require('email-verify');
var tokenHandler = require('../utils/tokenHandler');
var permissionModel = require('../models/permissions.model')
var userPermissionModel = require('../models/user_permissions.model')

module.exports = {
    register: (userInfo, role, res) => {
        return new Promise((resolve, reject) => {
            verifier.verify(userInfo.email, function (err, info) {
                if (err) return false;
                else {
                    if (userInfo.password.length < 6) {
                        return false;
                    }

                    var hashedPassword = bcrypt.hashSync(userInfo.password, 8);
                    var user = {
                        email: userInfo.email,
                        password: hashedPassword,
                        first_name: userInfo.first_name,
                        last_name: userInfo.last_name,
                        birth_date: userInfo.birth_date,
                        pseudonym: userInfo.pseudonym,
                    };

                    userModel.add(user).then(id => {
                        permissionModel.getByName(role)
                            .then(result => {
                                console.log("result : ", result);
                                console.log("result[0].id : ", result[0].id)
                                console.log("id: ", id);
                                userPermission = {
                                    permission_id: result[0].id,
                                    user_id: id,
                                }
                                userPermissionModel.add(userPermission)
                                    .then(result1 => {
                                        tokenHandler.issue(user.email, id, role)
                                            .then(token => {
                                                resolve(token);
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                reject(err);
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        reject(err);
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            })
                    })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        });
                }
            });
        })
    },

    login: (email, password) => {
        return new Promise((resolve, reject) => {
            if (password.length < 6) {
                var err = "Password is invalid";
                console.log("Password is invalid");
                reject(err);
            }
            userModel.getbyEmail(email)
                .then((result) => {
                    bcrypt.compare(password, result[0].password, function (err, res) {
                        if (res == false) {
                            err = "Wrong password";
                            console.log("Wrong password");
                            reject(err);
                        } else {
                            var user_id = result[0].id;
                            console.log("user_id: ", user_id);
                            userPermissionModel.getByUserID(result[0].id)
                                .then(result => {
                                    console.log("user permission: ", result[0]);
                                    permissionModel.single(result[0].permission_id)
                                        .then(result => {
                                            console.log("user permission: ", result[0]);
                                            tokenHandler.issue(email, user_id, result[0].name)
                                                .then(token => {
                                                    resolve(token);
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    reject(err);
                                                });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            reject(err);
                                        })
                                })
                                .catch(err => {
                                    console.log(err);
                                    reject(err);
                                })
                        }
                    })
                })
                .catch(err => {
                    console.log("User has not registered yet");
                    err = "User has not registered yet";
                    reject(err);
                })
        });
    },

    verify: (token, res) => {
        return tokenHandler.verify(token, res);
    },

    getPayLoadToken: (token, res) => {
        return tokenHandler.getPayload(token, res);
    },

    issueTokenWithUser: (user, res) => {
        return new Promise((resolve, reject) => {
            userPermissionModel.getByUserID(user.id)
            .then(result => {
                console.log("user permission: ", result[0]);
                permissionModel.single(result[0].permission_id)
                    .then(result => {
                        console.log("user permission: ", result[0]);
                        tokenHandler.issue(email, user_id, result[0].name)
                            .then(token => {
                                resolve(token);
                            })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    })
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
        })
    }
}