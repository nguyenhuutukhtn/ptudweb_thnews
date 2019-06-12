var articleModel=require('../models/article.model');

module.exports=(req,res,next)=>{


    articleModel.TopEightPopular().then(rows=>{
        res.locals.TopEightPopular=rows;
        next();
    })
}