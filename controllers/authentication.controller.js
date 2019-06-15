var bcrypt = require('bcryptjs');
var userModel = require('../models/users.model');
var verifier = require('email-verify');
var tokenHandler = require('../utils/tokenHandler');
var permissionModel = require('../models/permissions.model')
var userPermissionModel = require('../models/user_permissions.model')

module.exports = {
    register: (email, password, role, res) => {
        return new Promise((resolve, reject) => {
            verifier.verify(email, function (err, info) {
                if (err) return false;
                else {
                    if (password.length < 6) {
                        return false;
                    }

                    var hashedPassword = bcrypt.hashSync(password, 8);
                    var user = {
                        email: email,
                        password: hashedPassword,
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
            userModel.getbyEmail(email)
                .then((result) => {
                    bcrypt.compare(password, result[0].password)
                        .then(res => {
                            tokenHandler.issue(email, result[0].id, 'guest')
                                .then(token => {
                                    resolve(token);
                                })
                                .catch(err => {
                                    console.log(err);
                                    reject(err);
                                });
                        }
                        )
                        .catch(err => {
                            console.log(err);
                            err = "Wrong password";
                            reject(err);
                        })
                })
                .catch(err => {
                    console.log(err);
                    err = "User has not registered yet";
                    reject(err);
                })
        });
    },

    verify: async (token, res) => {
        await tokenHandler.verify(token, res);
    },

    getPayLoadToken: async (token, res) => {
        await tokenHandler.getPayload(token, res);
    },

    // logOut: async () => {

    // },
    // fbLogIn: async () => {

    // },
    // ggLogIn: async () => {

    // }
}