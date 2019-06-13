var db=require('../utils/db');

module.exports={
    all:()=>{
        return db.load('select * from article');
    },

    FourLastestNew:()=>{
        return db.load(
            'SELECT article.id,article.Title,article.Thumbnail,article.Summary,article.Content,article.Views,article.Liked,article.PublishDay,article.CreateDay,category.CatName,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article, category where article.CatId=category.id ORDER BY PublishDay desc LIMIT 4');
    },

    TopEightPopular:()=>{
        return db.load(
            'SELECT article.id,article.Title,article.Thumbnail,article.Views,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article ORDER BY article.Views desc LIMIT 8');
    },
    TopEightHot:()=>{
        return db.load(
            'select *,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article,category where article.CatId=category.id ORDER BY article.HotPoint desc LIMIT 8');
    },
    TopThreeHot:()=>{
        return db.load(
            'select *,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article ORDER BY article.HotPoint desc LIMIT 3');
    }

    
};