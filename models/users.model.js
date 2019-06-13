var db=require('../utils/db');

module.exports={
    all:()=>{
        return db.load('select * from users');
    },
    create : async (email, password, role) =>{
        await db.create('insert into users (email, password) values ($1, $2)', email, password);
        //await db.create('insert into permissions (name, user_id) values )
    }   
};