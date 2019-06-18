var express = require('express');
var articleModel = require('../models/article.model');
var cookieParser = require('cookie-parser')

var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/LastestPost.mdw'))
router.use(require('../middlewares/FourLastestNews.mdw'))
router.use(require('../middlewares/TopThreeHot.mdw'))

router.post('/', (req, res, next) => {
    var keyword=req.body.keyword;
    console.log(keyword);
    Promise.all([
        articleModel.ArticleByKeyWord(keyword)
    ]).then(([rows]) => {
        res.render('search', {
            ArticleByKeyWord: rows,
        });
        console.log(rows);
    })
})

module.exports = router;