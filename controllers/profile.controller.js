var userModel = require('../models/users.model');
var bcrypt = require('bcryptjs');

module.exports = {
    getInfo: (id) => {
        return new Promise((resolve, reject) => {
            userModel.single(id)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    },
    updateInfo: (id, newInfo) => {
        return new Promise((resolve, reject) => {
            userModel.single(id)
                .then(result => {
                    newInfo.password = result[0].password
                    newInfo.email = result[0].email
                    newInfo.id = result[0].id
                    if (newInfo.avatar == null){
                        newInfo.avatar = result[0].avatar;
                    }
                    userModel.update(newInfo)
                    .then(result => {
                        resolve(result);
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
    },
    updatePassword: (id, newPassword, oldPassword, confirmPassword) => {
        return new Promise((resolve, reject) => {
            console.log("id: ", id);
            userModel.single(id)
            .then(result => {
                if (newPassword.length < 6){
                    console.log("Lenth of password is invalid");
                    reject("Length of password is invalid");
                }
                if (oldPassword === newPassword){
                    console.log("New password can not be the same with old password");
                    reject("New password can not be the same with old password");
                }
                if (newPassword !== confirmPassword){
                    console.log("New password and confirm password is not the same");
                    reject("New password and confirm password is not the same");
                }
                bcrypt.compare(oldPassword, result[0].password, function (err, res) {
                    if (res == false) {
                        err = "Your password is wrong";
                        console.log("Your password is wrong");
                        reject(err);
                    } else {
                        var hashedPassword = bcrypt.hashSync(newPassword, 8);
                        result[0].password = hashedPassword
                        userModel.update(result[0])
                        .then(result => {
                            console.log("Success");
                            resolve(result);
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        })
                    }
                })
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
        })
    }
}