var db=require('../utils/db');

module.exports={
    TopFiveCommonKeywords:()=>{
        return db.load('SELECT keyword.Keyword ,count(keyword.Keyword) AS TimeSearch FROM keyword where datediff(now(),keyword.Time)<=15 group by(keyword.Keyword) order by TimeSearch desc limit 5');
    }
};