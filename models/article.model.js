var db=require('../utils/db');

module.exports={
    all:()=>{
        return db.load('select * from article');
    },

    FourLastestNew:()=>{
        return db.load('SELECT * FROM article ORDER BY PublishDay desc LIMIT 4');
    }

    
};