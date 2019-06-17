var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from permissions');
    },
    add: (entity) => {
        return db.add(`permissions`, entity);
    },
    update: (entity) => {
        return db.update('permissions', 'id', entity);
    },
    delete: (id) => {
        return db.delete('permissions', 'id', id);
    },
    getByName: (name) => {
        return db.load(`select * from permissions where name = '${name}'`);
    },
    single: (id) => {
        return db.load(`select * from permissions where id = ${id}`);
    }
};