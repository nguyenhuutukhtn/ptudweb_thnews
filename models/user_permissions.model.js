var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from user_permissions');
    },
    add: (entity) => {
        return db.add(`user_permissions`, entity);
    },
    update: (entity) => {
        return db.update('user_permissions', 'id', entity);
    },
    delete: (id) => {
        return db.delete('user_permissions', 'id', id);
    },
    single: (id) => {
        return db.load(`select * from user_permissions where id = ${id}`);
    },
    getByUserID: (user_id) => {
        return db.load(`select * from user_permissions where user_id = ${user_id}`);
    }
};