var articleModel=require('../models/article.model');

module.exports=(req,res,next)=>{


    articleModel.TopEightHot().then(rows=>{
        
        res.locals.TopEightHot=rows;
        next();
    })
}