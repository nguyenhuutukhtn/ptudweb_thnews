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
    },
    CatDetails: id => {
        var CatDetails= db.load(
            `SELECT * from category where category.id=${id};`);
            return CatDetails
    }
};