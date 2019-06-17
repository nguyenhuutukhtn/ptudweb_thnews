var commentModel=require('../models/comments.model');

module.exports=(req,res,next)=>{
    commentModel.FiveLastestComment().then(rows=>{
        res.locals.FiveLastestComment=rows;
        next();
    })
}