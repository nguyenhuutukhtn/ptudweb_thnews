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

router.get('/:id', (req, res) => {
    var id=req.params.id;
    var p = articleModel.articleDetail(id);
    p.then(rows => {
        res.render('article_details',{
            articleDetail:rows
        })
        //console.log(rows);
    }).catch(err => {
        console.log(err);
    });
})

module.exports = router;