var db = require('../utils/db');



module.exports = {
    all: () => {
        return db.load('select * from comments');
    },

    FiveLastestComment: () => {
        return db.load(`SELECT users.last_name,users.avatar, comment.content, timestampdiff(DAY, comment.commentDate, now()) as Times from comment, users where comment.userId = users.id order by(comment.commentDate) desc limit 5;`)
    },

    AllComments: id => {
        var AllComments= db.load(
            `SELECT users.last_name,users.avatar,comment.content,timestampdiff(DAY,comment.commentDate,now()) as Times FROM comment,users where comment.articleId=${id} and comment.userId=users.id;`);
            return AllComments
    }
};