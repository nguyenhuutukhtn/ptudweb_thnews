var articleModel=require('../models/article.model');


module.exports=(req,res,next)=>{


    articleModel.MostRecommend().then(rows=>{
        res.locals.MostRecommend=rows;
        next();
    })
}