var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from subscriber_registerations');
    },
    add: (entity) => {
        return db.add(`subscriber_registerations`, entity);
    },
    update: (entity) => {
        return db.update('subscriber_registerations', 'id', entity);
    },
    delete: (id) => {
        return db.delete('subscriber_registerations', 'id', id);
    },
    getByUserID : (user_id) => {
        return db.load(`select * from subscriber_registerations where user_id = ${user_id}`);
    }
};