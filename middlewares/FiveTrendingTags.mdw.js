var tagsModel=require('../models/tags.model');

module.exports=(req,res,next)=>{
    tagsModel.FiveTrendingTags().then(rows=>{
        res.locals.FiveTrendingTags=rows;
        next();
    })
}