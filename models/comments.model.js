var db = require('../utils/db');



module.exports = {
    all: () => {
        return db.load('select * from comments');
    },

    FiveLastestComment: () => {
        return db.load(`SELECT users.last_name,users.avatar, comment.content, timestampdiff(DAY, comment.commentDate, now()) as Times from comment, users where comment.userId = users.id order by(comment.commentDate) desc limit 5;`)
    },
};