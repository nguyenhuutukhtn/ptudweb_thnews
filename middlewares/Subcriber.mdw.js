var userModel=require('../models/users.model');


module.exports=(req,res,next)=>{


    userModel.Subcriber().then(rows=>{
        res.locals.Subcriber=rows;
        next(); 
    })
}