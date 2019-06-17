var db=require('../utils/db');

module.exports={
    all:()=>{
        return db.load('select * from tags');
    },

    TenTrendingTags: () => {
        return db.load(`select* ,count(*) as Times from tag group by(tag.content) order by(Times) desc limit 10;`)
    },

    FiveTrendingTags: () => {
        return db.load(`select* ,count(*) as Times from tag group by(tag.content) order by(Times) desc limit 5;`)
    },
};