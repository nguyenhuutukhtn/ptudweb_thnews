var db=require('../utils/db');

module.exports={
    all:()=>{
        return db.load('select * from tags');
    },

    TenTrendingTags: () => {
        return db.load(`select tag.content ,count(*) as Times from tag group by(tag.content) order by(Times) desc limit 10;`)
    },

    FiveTrendingTags: () => {
        return db.load(`select tag.content ,count(*) as Times from tag group by(tag.content) order by(Times) desc limit 5;`)
    },

    AllTags: id => {
        var AllTags= db.load(
            `SELECT * FROM tag where tag.articleId=${id}`);
            return AllTags
    },
    AddNewTag:(articleId,content)=>{
        return db.load(`insert into tag(id,articleId,content,dateCreate) value(0,${articleId},'${content}',now());`);
    }
};