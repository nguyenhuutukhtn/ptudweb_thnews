var articleModel=require('../models/article.model');


module.exports=(req,res,next)=>{


    articleModel.LastestPost().then(rows=>{
        res.locals.LastestPost=rows;
        next();
    })
}