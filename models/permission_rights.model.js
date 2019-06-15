var db=require('../utils/db');

module.exports={
    all:()=>{
        return db.load('select * from users');
    },
    add : (email, password) =>{
        return db.add('insert into users (email, password) values ($1, $2)', email, password);
    },
    update : async (newUser) => {

    }
};