var articleModel=require('../models/article.model');


module.exports=(req,res,next)=>{


    articleModel.HotInWeek().then(rows=>{
        res.locals.HotInWeek=rows;
        next();
    })
}