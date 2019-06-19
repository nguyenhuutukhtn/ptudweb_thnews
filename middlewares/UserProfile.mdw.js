var userModel=require('../models/users.model');


module.exports=(req,res,next)=>{


    userModel.UserProfile().then(rows=>{
        res.locals.UserProfile=rows;
        next(); 
    })
}