var express = require('express');
var articleModel = require('../models/article.model');
var usersModel = require('../models/users.model');
var commentModel = require('../models/comments.model');
var tagModel = require('../models/tags.model');
var catModel = require('../models/category.model');
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

<<<<<<< HEAD
var guestRole = require('../middlewares/guestRole.mdw');
router.use('/', guestRole);

router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 4;
    var offset = (page - 1) * limit;

    Promise.all([
        articleModel.PageByCat(id, limit, offset),
        articleModel.CountByCat(id),
        catModel.CatDetails(id)
    ]).then(([rows, count_rows,CatDetails]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('category', {
            articleByCat: rows,
            CatDetails:CatDetails,
            pages
        });
    })
=======
router.get('/:id', (req, res) => {
    res.render('category')
>>>>>>> 455f6dea4e4482c48e478b0ec117345d80273e57
})


module.exports = router;