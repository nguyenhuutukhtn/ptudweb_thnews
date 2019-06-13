var articleModel=require('../models/article.model');


module.exports=(req,res,next)=>{


    articleModel.AnotherNews().then(rows=>{
        res.locals.AnotherNews=rows;
        next();
    })
}