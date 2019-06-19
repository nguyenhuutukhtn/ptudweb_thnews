var articleModel=require('../models/article.model');


module.exports=(req,res,next)=>{


    articleModel.UnconfirmPost().then(rows=>{
        res.locals.UnconfirmPost=rows;
        next();
    })
}