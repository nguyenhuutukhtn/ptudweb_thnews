var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from category');
    },
    ChildrenOfNews:()=>{
        return db.load(`select * from category where category.ParentId=2;`)
    },

    ChildrenOfReader:()=>{
        return db.load(`select * from category where category.ParentId=8;`)
    }
};