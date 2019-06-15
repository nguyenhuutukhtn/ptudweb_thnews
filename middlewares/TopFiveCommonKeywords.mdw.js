var keywordModel=require('../models/keyword.model');


module.exports=(req,res,next)=>{


    keywordModel.TopFiveCommonKeywords().then(rows=>{
        res.locals.TopFiveCommonKeywords=rows;
        next();
    })
}