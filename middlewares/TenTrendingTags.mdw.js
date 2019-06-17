var tagsModel=require('../models/tags.model');

module.exports=(req,res,next)=>{
    tagsModel.TenTrendingTags().then(rows=>{
        res.locals.TenTrendingTags=rows;
        next();
    })
}