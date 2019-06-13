var articleModel=require('../models/article.model');


module.exports=(req,res,next)=>{


    articleModel.TopFourRecommend().then(rows=>{
        res.locals.TopFourRecommend=rows;
        next();
    })
}