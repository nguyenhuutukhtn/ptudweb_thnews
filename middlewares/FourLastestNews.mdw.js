var articleModel=require('../models/article.model');

module.exports=(req,res,next)=>{
    articleModel.FourLastestNew().then(rows=>{
        res.locals.lastesArticles=rows;
        next();
    })

    // articleModel.TopEightPopular().then(rows=>{
    //     res.locals.TopEightPopular=rows;
    //     next();
    // })
}