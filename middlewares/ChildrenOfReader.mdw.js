var categoryModel=require('../models/category.model');


module.exports=(req,res,next)=>{


    categoryModel.ChildrenOfReader().then(rows=>{
        res.locals.ChildrenOfReader=rows;
        next();
    })
}