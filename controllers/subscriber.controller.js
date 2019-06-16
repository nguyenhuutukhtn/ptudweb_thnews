var subscriberRegisterationsModel = require('../models/subscriber_registerations.model');
var userModel = require('../models/users.model');

module.exports = {
    register: (id) => {
        return new Promise((resolve, reject) => {
            userModel.single(id)
                .then(user => subscriberRegisterationsModel.add()
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    }))
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }
}