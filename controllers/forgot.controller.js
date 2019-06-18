var userModel = require('../models/users.model');
var bcrypt = require('bcryptjs');
var tokenHandler = require('../utils/tokenHandler');
var userPermissionModel = require('../models/user_permissions.model');
var permissionModel = require('../models/permissions.model');

module.exports = {
    reset: (email, newPassword, confirmPassword) =>{
        return new Promise((resolve, reject) => {
            if (newPassword !== confirmPassword){
                console.log("New password and confirm password need to be similar");
                reject("New password and confirm password need to be similar");
            }
            userModel.getbyEmail(email)
                .then(result => {
                    var hashedPassword = bcrypt.hashSync(newPassword, 8);
                    console.log("result[0]: ", result[0]);
                    result[0].password = hashedPassword
                    var id = result[0].id;
                        userModel.update(result[0])
                        .then(result => {
                            userPermissionModel.getByUserID(id)
                                .then(result => {
                                    console.log("user permission: ", result[0]);
                                    permissionModel.single(result[0].permission_id)
                                        .then(result => {
                                            console.log("user permission: ", result[0]);
                                            tokenHandler.issue(email, id, result[0].name)
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