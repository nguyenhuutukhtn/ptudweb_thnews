var permissionModel = require('../models/permissions.model');
var userModel = require('../models/users.model');
var userPermissionModel = require('../models/user_permissions.model');
var bcrypt = require('bcryptjs');
var tokenHandler = require('../utils/tokenHandler');

module.exports = {
    register: (email, password, confirmPassword, role) => {
        console.log("email: ", email);
        console.log("password: ", password);
        console.log("confirmPassword: ", confirmPassword);
        console.log("role: ", role);
        return new Promise((resolve, reject) => {
            if (password !== confirmPassword) {
                console.log("Password and confirm password need to be similar");
                reject("Password and confirm password need to be similar");
            }
            if (password.length < 6) {
                console.log("Password is invalid");
                reject("Password is invalid");
            }
            var hashedPassword = bcrypt.hashSync(password, 8);
            var user = {
                email: email,
                password: hashedPassword
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
        })
    },
}