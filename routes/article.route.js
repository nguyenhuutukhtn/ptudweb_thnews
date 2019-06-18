var express = require('express');
var articleModel = require('../models/article.model');
var usersModel = require('../models/users.model');
var commentModel = require('../models/comments.model');
var tagModel = require('../models/tags.model');
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
    p.then(articleDetail => {
        var q=articleModel.RelateNews(id);
        q.then(RelateNews=>{
            var r=tagModel.AllTags(id);
            r.then(AllTags=>{
                var t=usersModel.Writer(id);
                t.then(Writer=>{
                    var x=commentModel.AllComments(id);
                    x.then(AllComments=>{
                        res.render('article_details',{
                            relateNews:RelateNews,
                            articleDetail:articleDetail,
                            AllTags:AllTags,
                            Writer:Writer,
                            AllComments:AllComments
                        });
                    })
                })
            })    
            
        })
        
        //console.log(rows);
    }).catch(err => {
        console.log(err);
    });
})

module.exports = router;