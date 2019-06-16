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
            'SELECT article.id,article.Title,article.Thumbnail,article.Summary,article.Content,article.Views,article.Liked,article.PublishDay,article.CreateDay,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article ORDER BY article.Views desc LIMIT 8');
    },
    TopEightHot:()=>{
        return db.load(
            'select article.id,article.Title,article.Thumbnail,article.Summary,article.Content,article.Views,article.Liked,article.PublishDay,article.CreateDay,category.CatName,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article,category where article.CatId=category.id ORDER BY article.HotPoint desc LIMIT 8');
    },
    TopThreeHot:()=>{
        return db.load(
            'SELECT article.Id,article.Title,article.Thumbnail,article.Summary,article.Views,article.Liked,category.CatName,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article,category WHERE article.CatId=category.id ORDER BY article.HotPoint desc LIMIT 3');
    },
    MostRecommend:()=>{
        return db.load(
            'select article.id,article.Title,article.Thumbnail,article.Summary,article.Content,article.Views,article.Liked,article.PublishDay,article.CreateDay,category.CatName,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate from article,category where article.CatId=category.id and article.PriorityPoint in (select max(article.PriorityPoint) from article)');
    },
    TopFourRecommend:()=>{
        return db.load(
            'select article.id,article.Title,article.Thumbnail,article.Summary,article.Content,article.Views,article.Liked,article.PublishDay,article.CreateDay,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article ORDER BY article.PriorityPoint desc LIMIT 4');
    },
    AnotherNews:()=>{
        return db.load(
            'SELECT article.id,article.Title,article.Thumbnail,article.Summary,article.Content,article.Views,article.Liked,article.PublishDay,article.CreateDay,category.CatName,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article,category WHERE article.CatId=category.id ORDER BY RAND() LIMIT 4;');
    },
    HotInWeek:()=>{
        return db.load(
            'SELECT article.Id,article.Title,article.Thumbnail,article.Summary,article.Views,article.Liked,category.CatName,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article,category WHERE article.CatId=category.id AND DATEDIFF(NOW(),article.PublishDay) < 7 order by(article.Views) desc limit 7;');
    },
    articleDetail: id=>{
        return db.load(
            `SELECT * ,date_format(article.PublishDay,"%d/ %m/ %Y") AS PublishDate FROM article,category WHERE article.CatId=category.id AND article.Id=${id};`);
    },
    LastestPost:()=>{
        return db.load(
            'SELECT article.Id,article.Title,article.Thumbnail,article.Summary,article.Views,article.Liked,category.CatName,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article,category WHERE article.CatId=category.id AND article.PublishDay in (select MAX(article.PublishDay) from article) limit 1;');
    },
    RelatesArticle: CatId=>{
        return db.load(
            `SELECT article.Id,article.Title,article.Thumbnail,article.Summary,article.Views,article.Liked,category.CatName,date_format(article.PublishDay,"%M %d, %Y") AS PublishDate FROM article,category WHERE article.CatId=category.id AND category.id=${CatId} and datediff(now(),article.PublishDay)<10 order by rand() limit 2;`);
    }
};