var subscriberRegisterationsModel = require('../models/subscriber_registerations.model');
var userModel = require('../models/users.model');

module.exports = {
    register: (id) => {
        return new Promise((resolve, reject) => {
            userModel.single(id)
                .then(user => {
                    subscriberRegisterations = {
                        user_id: user[0].id
                    }
                    subscriberRegisterationsModel.add(subscriberRegisterations)
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
    verify : (id) => {
        return new Promise((resolve, reject) => {
            userModel.single(id)
            .then(result => {
                var res;
                var timeNow = Math.floor(Date.now() / 1000);
                console.log("timeNow: ", timeNow);
                var unixTimestamp = Math.round(new Date(result[0].subscribe_date).getTime()/1000);
                console.log(unixTimestamp);
                var temp = timeNow - unixTimestamp;
                if (temp >= 0 && temp <= 604800){
                    res = true;
                } else {
                    res = false;
                }
                resolve(res);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
        })
    },
    confirm : (id) => {
        return new Promise((resolve, reject) => {
            userModel.single(id)
            .then(result => {
                result[0].subscribe_date = new Date('2020-06-19');
                userModel.update(result[0])
                .then(result => {
                    subscriberRegisterationsModel.getByUserID(id)
                    .then(result => {
                        subscriberRegisterationsModel.delete(result[0].id)
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