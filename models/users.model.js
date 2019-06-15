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
    },
    feadturedWritter:()=>{
        return db.load(`Select users.avatar,users.pseudonym,users.name,users.stars,count(article.Id) as PostNum from users,article where users.stars in (select MAX(users.stars) from users) and users.id=article.WriterId group by(users.id)`);
    }
};