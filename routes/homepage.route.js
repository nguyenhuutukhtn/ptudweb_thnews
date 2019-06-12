var express=require('express');
var articleModel=require('../models/article.model');

var router=express.Router();

router.get('/',(req,res)=>{
    var p=articleModel.all();
    p.then(rows=>{
        res.render('home')
        //console.log(rows);
    }).catch(err=>{
        console.log(err);
    });
})

module.exports=router;