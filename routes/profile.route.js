var express = require('express');
var articleModel = require('../models/article.model');
var userModel = require('../models/users.model');
var cookieParser = require('cookie-parser')

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

router.get('/', (req, res, next) => {
    
        Promise.all([
            userModel.UserProfile(res.id)
        ]).then(([rows]) => {
            res.render('profile', {
                UserProfile: rows
            });
        })
    })

module.exports = router;