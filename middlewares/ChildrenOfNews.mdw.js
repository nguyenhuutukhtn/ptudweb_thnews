var categoryModel=require('../models/category.model');


module.exports=(req,res,next)=>{


    categoryModel.ChildrenOfNews().then(rows=>{
        res.locals.ChildrenOfNews=rows;
        next();
    })
}