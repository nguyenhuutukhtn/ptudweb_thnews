var userModel=require('../models/users.model');


module.exports=(req,res,next)=>{


    userModel.feadturedWritter().then(rows=>{
        res.locals.feadturedWritter=rows;
        next();
    })
}