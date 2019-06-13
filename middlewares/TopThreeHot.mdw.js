var articleModel=require('../models/article.model');


module.exports=(req,res,next)=>{


    articleModel.TopThreeHot().then(rows=>{
        res.locals.TopThreeHot=rows;
        next();
    })
}