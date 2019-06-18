var express = require('express');
var articleModel = require('../models/article.model');
var usersModel = require('../models/users.model');
var commentModel = require('../models/comments.model');
var tagModel = require('../models/tags.model');
var cookieParser = require('cookie-parser')
var subscriberController = require('../controllers/subscriber.controller');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/LastestPost.mdw'))
router.use(require('../middlewares/FourLastestNews.mdw'))
router.use(require('../middlewares/TopThreeHot.mdw'))

var guestRole = require('../middlewares/guestRole.mdw');
router.use('/', guestRole);

router.get('/:id', (req, res) => {
    var id = req.params.id;
    var p = articleModel.articleDetail(id);

    console.log(0);
    p.then(articleDetail => {
        var q = articleModel.RelateNews(id);
        console.log(1);
        q.then(RelateNews => {
            var r = tagModel.AllTags(id);
            console.log(2);
            r.then(AllTags => {
                console.log(3);
                var t = usersModel.Writer(id);
                t.then(Writer => {
                    console.log(4);
                    var x = commentModel.AllComments(id);
                    x.then(AllComments => {
                        console.log(5);
                        if (articleDetail[0].isPremium === 1) {
                            subscriberController.verify(res.id)
                                .then(result => {
                                    console.log(6);
                                    if (result === false) {
                                        res.render('/401');
                                        return
                                    }
                                })
                                .catch(err => {
                                    console.log(7);
                                    console.log(err);
                                    res.render('/500');
                                    return
                                })
                        }
                        res.render('article_details', {
                            relateNews: RelateNews,
                            articleDetail: articleDetail,
                            AllTags: AllTags,
                            Writer: Writer,
                            AllComments: AllComments
                        });
                    })
                })
            })
        })

        // if (articleDetail[0].isPremium === 1) {
        //     subscriberController.verify(res.id)
        //         .then(result => {
        //             console.log(6);
        //             if (result === false) {
        //                 res.render('/401');
        //                 return
        //             }
        //         })
        //         .catch(err => {
        //             console.log(7);
        //             console.log(err);
        //             res.render('/500');
        //             return
        //         })
        // }
        //console.log(rows);
    }).catch(err => {
        console.log(10);
        console.log(err);
    });
})

module.exports = router;