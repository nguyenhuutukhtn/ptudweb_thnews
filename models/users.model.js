var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from users');
    },
    add: (entity) => {
        return db.add(`users`, entity);
    },
    update: (entity) => {
        return db.update('users', 'id', entity);
    },
    delete: (id) => {
        return db.delete('users', 'id', id);
    },
    single: (id) => {
        return db.load(`select * from users where id = ${id}`);
    },
    getbyEmail: (email) => {
        return db.load(`select * from users where email = '${email}'`);
    },
    getByFacebookID: (facebook_id) => {
        return db.load(`select * from users where facebook_id = '${facebook_id}'`);
    }
};