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
    getByGoogleID: (google_id) => {
        return db.load(`select * from users where google_id = '${google_id}'`);
    },
    feadturedWritter:()=>{
        return db.load(`Select users.avatar,users.pseudonym,users.last_name,users.stars,count(article.Id) as PostNum from users,article where users.stars in (select MAX(users.stars) from users) and users.id=article.WriterId group by(users.id)`);
    },

    Writer: id => {
        var Writer= db.load(
            `SELECT users.last_name,users.avatar FROM users,article where article.WriterId=users.id and article.Id=${id}`);
            return Writer
    },
    UserProfile: id=>{
        var UserProfile= db.load(
            `SELECT * FROM users where users.id=${id}`);
            return UserProfile
    },
    Subcriber: ()=>{
        var Subcriber= db.load(
            `SELECT * FROM users,subcriber_registrations where users.id=subcriber_registrations.user_id`);
            return Subcriber
    }
};